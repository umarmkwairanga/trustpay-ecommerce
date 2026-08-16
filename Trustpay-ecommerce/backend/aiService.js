import 'dotenv/config';
import OpenAI from 'openai';

// We initialize the client inside a function or check for the key
// to ensure process.env is fully populated when called.
const getOpenAI = () => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY in environment variables.");
    }
    return new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
};

// Advanced Copywriting Service
export const generateProductDescription = async (details) => {
    const { name, features, targetAudience, tone } = details;
    const openai = getOpenAI();

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a world-class ecommerce copywriter for TrustPayEcommerceEcommerce. You write high-converting, professional, and SEO-friendly descriptions." },
                { 
                    role: "user", 
                    content: `Write a compelling product description for: ${name}. 
                            Key Features: ${features}. 
                            Target Audience: ${targetAudience}. 
                            Tone: ${tone}. 
                            Include a punchy headline and a clear call-to-action.` 
                }
            ],
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error("AI Copywriting Service Error:", error);
        throw error;
    }
};

// Fraud Detection Service
export const analyzeFraudRisk = async (orderData) => {
    const openai = getOpenAI();
    
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a TrustPayEcommerceEcommerce fraud detection expert. Analyze the provided order data and return a JSON object with a 'riskScore' (1-100) and a 'reasoning' string." },
                { role: "user", content: `Analyze this order for potential fraud: ${JSON.stringify(orderData)}` }
            ],
            response_format: { type: "json_object" }
        });
        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error("AI Fraud Detection Error:", error);
        throw error;
    }
};