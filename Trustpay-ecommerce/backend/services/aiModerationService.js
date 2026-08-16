const axios = require('axios');
const Category = require('../models/Category');

const AI_API_KEY = process.env.AI_API_KEY;
const AI_ENDPOINT = process.env.AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';

/**
 * Evaluates product suitability and categorisation against marketplace rules.
 */
async function evaluateProductWithAI({ productName, productDescription, proposedCategory }) {
  if (!AI_API_KEY) {
    throw new Error('AI Service configuration missing API key.');
  }

  // Fetch active existing categories to provide context to the LLM
  const existingCategories = await Category.find({ status: 'active' }).select('name _id');
  const categoryListString = existingCategories.map(c => `- ${c.name} (ID: ${c._id})`).join('\n');

  const systemPrompt = `
You are an advanced TrustPayEcommerce Marketplace Compliance and Categorization AI agent.
Your objective is to evaluate whether a seller's product is legal, safe, and appropriate to list, and determine its category.

RULES:
1. DO NOT reject a product simply because it is unusual, new, uncommon, or doesn't exist in current categories. If it's a legal product, lean towards approval.
2. Prohibited goods include: illegal drugs, weapons, counterfeit items, hazardous materials, adult content, or fraud-related items.
3. Compare the product's proposed category against the existing categories. If an existing category is a semantic match, choose USE_EXISTING_CATEGORY.
4. If no existing category fits, but the product is legal, choose APPROVED_NEW_CATEGORY and provide a clean professional category name.
5. If uncertain about legality or policy violations, choose AI_REVIEW_REQUIRED.
6. If strictly prohibited, choose REJECTED.

EXISTING CATEGORIES:
${categoryListString}

OUTPUT FORMAT:
Return ONLY valid JSON matching this schema:
{
  "decision": "APPROVED_NEW_CATEGORY" | "USE_EXISTING_CATEGORY" | "REJECTED" | "AI_REVIEW_REQUIRED",
  "categoryName": "Name of category if APPROVED_NEW_CATEGORY else null",
  "existingCategoryId": "MongoDB ID string if USE_EXISTING_CATEGORY else null",
  "confidence": 0.0 to 1.0,
  "reasoning": "Clear explanation of the decision"
}
`;

  const userPrompt = `
Product Name: ${productName}
Product Description: ${productDescription}
Seller Proposed Category/Item Type: ${proposedCategory}
`;

  try {
    const response = await axios.post(AI_ENDPOINT, {
      model: AI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    }, {
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    const content = response.data.choices[0].message.content;
    const parsedResponse = JSON.parse(content);
    
    // Backend Validation of AI response fields
    if (!['APPROVED_NEW_CATEGORY', 'USE_EXISTING_CATEGORY', 'REJECTED', 'AI_REVIEW_REQUIRED'].includes(parsedResponse.decision)) {
      throw new Error('Invalid decision format returned by AI engine.');
    }

    return parsedResponse;
  } catch (error) {
    console.error('AI Moderation Service Error:', error.message);
    // Fallback security behavior if AI service fails
    return {
      decision: 'AI_REVIEW_REQUIRED',
      confidence: 0.0,
      reasoning: 'AI moderation engine unavailable. Routed for manual review.'
    };
  }
}

module.exports = { evaluateProductWithAI };