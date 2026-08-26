const axios = require('axios');

class FreelancerAIService {
  constructor() {
    this.apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  }

  async analyzeVerificationEvidence(evidenceData) {
    if (!this.apiKey) {
      // Fallback rule-based logic if API key is missing
      return { status: 'REVIEW', score: 70, reasoning: 'Manual review required (AI API key not set).' };
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const prompt = `Analyze freelancer verification data for risk and quality. Return valid JSON only:
      {
        "status": "PASS" | "REVIEW" | "FAIL",
        "confidenceScore": number,
        "reasoning": "string explanation",
        "riskSignals": ["string"]
      }
      Data: ${JSON.stringify(evidenceData)}`;

      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      });

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return JSON.parse(text);
    } catch (error) {
      console.error('Freelancer AI Verification Error:', error.message);
      return { status: 'REVIEW', score: 50, reasoning: 'AI analysis failed; defaulted to manual review.' };
    }
  }
}

module.exports = new FreelancerAIService();