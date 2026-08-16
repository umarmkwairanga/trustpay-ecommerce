import Product from '../models/Product.js';
import Category from '../models/Category.js';
import AiAuditLog from '../models/AiAuditLog.js';
import { evaluateProductWithAI } from '../services/aiModerationService.js';
import slugify from 'slugify';

export const addProduct = async (req, res) => {
    try {
        // Destructure fields, including dynamic category fields
        const { name, description, price, category, proposedCategory, condition, stock } = req.body;
        const sellerId = req.user.id || req.user._id;
        
        // Handle image path from uploaded file via Multer or direct body string
        const imagePath = req.file ? req.file.path : req.body.imagePath;

        // Basic payload validation
        if (!name || !price || !condition || !imagePath) {
            return res.status(400).json({ 
                success: false,
                message: "Please provide all required fields (name, price, condition, imagePath/image file)" 
            });
        }

        // Determine if seller selected an existing category ID or requested a dynamic one
        const isDynamicCategory = !category || category === 'dynamic' || proposedCategory;
        const proposedCategoryName = proposedCategory || (isDynamicCategory ? name : null);

        if (!category && !proposedCategoryName) {
            return res.status(400).json({ 
                success: false, 
                message: "Please select an existing category or provide a proposed category name." 
            });
        }

        let finalCategoryId = null;
        let productStatus = 'active';
        let aiResult;

        if (isDynamicCategory || !category) {
            // 1. Fetch active categories for AI context so it can match against existing ones if appropriate
            const existingCategories = await Category.find({ status: 'active' }).select('name _id');

            // 2. Run AI Evaluation for New/Unmatched Categories
            aiResult = await evaluateProductWithAI({
                productName: name,
                productDescription: description || '',
                proposedCategory: proposedCategoryName,
                existingCategories: existingCategories.map(c => ({ id: c._id, name: c.name }))
            });
        } else {
            // Validate that the selected existing category actually exists
            const existingCat = await Category.findById(category);
            if (!existingCat) {
                return res.status(400).json({ success: false, message: "Selected category does not exist." });
            }
            finalCategoryId = existingCat._id;
            aiResult = {
                decision: 'USE_EXISTING_CATEGORY',
                existingCategoryId: existingCat._id,
                confidence: 1.0,
                reasoning: 'Seller explicitly selected existing valid category.'
            };
        }

        const confidenceThreshold = parseFloat(process.env.AI_CONFIDENCE_THRESHOLD || 0.70);

        // Handle AI Decisions & Confidence threshold routing
        if (aiResult.decision === 'REJECTED' || (aiResult.confidence < confidenceThreshold && aiResult.decision === 'APPROVED_NEW_CATEGORY')) {
            if (aiResult.decision !== 'REJECTED') {
                aiResult.decision = 'AI_REVIEW_REQUIRED';
            }
        }

        if (aiResult.decision === 'REJECTED') {
            await AiAuditLog.create({
                sellerId,
                proposedCategory: proposedCategoryName,
                decision: 'REJECTED',
                confidence: aiResult.confidence,
                reason: aiResult.reasoning || 'Prohibited marketplace policy violation.'
            });

            return res.status(400).json({
                success: false,
                decision: 'REJECTED',
                message: "This product cannot be listed on TrustPayEcommerceEcommerce."
            });
        }

        if (aiResult.decision === 'AI_REVIEW_REQUIRED') {
            const fallbackCategory = await Category.findOne();
            const newProduct = new Product({
                name,
                description,
                price,
                category: finalCategoryId || (fallbackCategory ? fallbackCategory._id : null),
                proposedCategoryName,
                condition,
                imagePath,
                stock: stock || 0,
                seller: sellerId,
                status: 'ai_review'
            });
            await newProduct.save();

            await AiAuditLog.create({
                sellerId,
                productId: newProduct._id,
                proposedCategory: proposedCategoryName,
                decision: 'AI_REVIEW_REQUIRED',
                confidence: aiResult.confidence,
                reason: aiResult.reasoning
            });

            return res.status(202).json({
                success: true,
                decision: 'AI_REVIEW_REQUIRED',
                message: "This product has been sent for TrustPayEcommerce Admin review."
            });
        }

        if (aiResult.decision === 'USE_EXISTING_CATEGORY') {
            const targetId = aiResult.existingCategoryId || category;
            const validCategory = await Category.findById(targetId);
            if (!validCategory) {
                return res.status(400).json({ success: false, message: "Invalid category reference." });
            }
            finalCategoryId = validCategory._id;
        } 
        else if (aiResult.decision === 'APPROVED_NEW_CATEGORY') {
            const catName = aiResult.categoryName || proposedCategoryName;
            const slug = slugify(catName, { lower: true, strict: true });

            // Duplicate Category Protection (exact name, case-insensitive, or slug match)
            let existingCategory = await Category.findOne({
                $or: [
                    { slug },
                    { name: { $regex: new RegExp(`^${catName}$`, 'i') } }
                ]
            });

            if (existingCategory) {
                finalCategoryId = existingCategory._id;
                aiResult.decision = 'USE_EXISTING_CATEGORY';
            } else {
                const newCategory = await Category.create({
                    name: catName,
                    slug,
                    createdBy: sellerId,
                    approvalMethod: 'ai_auto',
                    aiConfidenceScore: aiResult.confidence,
                    aiReason: aiResult.reasoning,
                    status: 'active'
                });
                finalCategoryId = newCategory._id;
            }
        }

        // 3. Create and Publish Product Live
        const newProduct = new Product({
            name,
            description,
            price,
            category: finalCategoryId,
            proposedCategoryName,
            condition,
            imagePath,
            stock: stock || 0,
            seller: sellerId,
            status: productStatus
        });

        await newProduct.save();

        // 4. Record Audit Trail Log
        await AiAuditLog.create({
            sellerId,
            productId: newProduct._id,
            proposedCategory: proposedCategoryName || 'Standard Category',
            decision: aiResult.decision,
            confidence: aiResult.confidence,
            existingCategoryId: aiResult.existingCategoryId || null,
            finalCategoryId,
            reason: aiResult.reasoning || 'Auto-approved legal product.'
        });

        return res.status(201).json({ 
            success: true, 
            message: "Product listed successfully", 
            decision: aiResult.decision,
            product: newProduct 
        });

    } catch (err) {
        console.error("Error listing product with AI check:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Error listing product due to internal server error", 
            error: err.message 
        });
    }
};