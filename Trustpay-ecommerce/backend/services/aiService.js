const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Evaluates product listings for safety, prohibited items, and category matching.
 */
exports.evaluateProductListing = async (productData, existingCategories) => {
    try {
        const prompt = `
        You are an e-commerce platform compliance and categorization AI for TrustPayEcommerceEcommerce.
        Analyze the following product listing:
        - Name: ${productData.name}
        - Description: ${productData.description}
        - Proposed Category (if any): ${productData.proposedCategory || 'None'}
        - Existing Categories: ${JSON.stringify(existingCategories.map(c => ({ id: c._id, name: c.name })))}

        Task:
        1. Check for illegal items, weapons, adult content, scams, or prohibited e-commerce goods. If unsafe, set decision to "REJECTED".
        2. If safe, determine the appropriate category. If an existing category matches well, return its ID with decision "USE_EXISTING_CATEGORY".
        3. If a proposed category is given and valid, approve it with decision "APPROVED_NEW_CATEGORY".
        4. Assign a confidence score between 0.0 and 1.0. If confidence is below ${process.env.AI_CONFIDENCE_THRESHOLD || 0.70}, set decision to "AI_REVIEW_REQUIRED".

        Return ONLY a valid JSON object in this exact format:
        {
          "decision": "USE_EXISTING_CATEGORY" | "APPROVED_NEW_CATEGORY" | "AI_REVIEW_REQUIRED" | "REJECTED",
          "categoryId": "matched_existing_category_id_or_null",
          "newCategoryName": "cleaned_proposed_category_name_or_null",
          "confidence": 0.95,
          "reason": "Brief explanation"
        }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const textResponse = response.text.trim();
        const cleanJson = textResponse.replace(/^```json\s*|\s*```$/g, '');
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error('AI Moderation Service Error:', error);
        // Fallback to manual review if AI fails
        return {
            decision: 'AI_REVIEW_REQUIRED',
            categoryId: null,
            newCategoryName: productData.proposedCategory || null,
            confidence: 0.0,
            reason: 'AI service fallback due to processing error.'
        };
    }
};