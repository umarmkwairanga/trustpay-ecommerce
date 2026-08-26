const axios = require('axios');

class MentorAIService {
  constructor() {
    this.apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    this.provider = process.env.AI_PROVIDER || 'gemini'; // gemini or openai
  }

  async callAI(prompt, systemInstruction = '', responseJson = false) {
    if (!this.apiKey) {
      throw new Error('AI API key is not configured on the server.');
    }

    try {
      if (this.provider === 'gemini') {
        // Using standard Google Gemini API endpoint structure
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        const payload = {
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          generationConfig: responseJson ? { responseMimeType: "application/json" } : {}
        };
        const response = await axios.post(url, payload);
        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } else {
        // Fallback / OpenAI implementation
        const url = 'https://api.openai.com/v1/chat/completions';
        const messages = [];
        if (systemInstruction) messages.push({ role: 'system', content: systemInstruction });
        messages.push({ role: 'user', content: prompt });

        const response = await axios.post(url, {
          model: 'gpt-4o-mini',
          messages,
          response_format: responseJson ? { type: "json_object" } : { type: "text" }
        }, {
          headers: { Authorization: `Bearer ${this.apiKey}` }
        });
        return response.data.choices[0].message.content;
      }
    } catch (error) {
      console.error('AI Provider Error:', error.response?.data || error.message);
      throw new Error('Failed to generate response from AI provider.');
    }
  }

  async chatWithMentorAI(contextData, userMessage, history = []) {
    const systemInstruction = `You are TrustPayEcommerce Mentor AI, an educational learning assistant. 
    You assist mentees and human mentors. 
    RULES: Never claim to be a human mentor. Never issue or approve certificates. Never alter escrows, payments, user roles, or official grades. Be concise, educational, and helpful.`;
    
    const contextPrompt = `Context Data: ${JSON.stringify(contextData)}\n\nChat History:\n${history.map(h => `${h.role}: ${h.text}`).join('\n')}\n\nUser: ${userMessage}`;
    return await this.callAI(contextPrompt, systemInstruction);
  }

  async generateQuiz(contextData, options) {
    const systemInstruction = `Generate a quiz based on the provided lesson/program material. Return STRICT JSON in this format:
    {
      "title": "Quiz Title",
      "questions": [
        {
          "question": "...",
          "type": "multiple-choice",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A",
          "explanation": "..."
        }
      ]
    }`;
    const prompt = `Topic/Lesson: ${options.topic || contextData.lessonTitle}\nDifficulty: ${options.difficulty || 'medium'}\nNumber of Questions: ${options.count || 5}\nMaterial: ${JSON.stringify(contextData)}`;
    const result = await this.callAI(prompt, systemInstruction, true);
    return JSON.parse(result);
  }

  async generateStudyPlan(contextData) {
    const systemInstruction = `Generate a personalized study plan in valid JSON format with weekly or milestone breakdown based on learner progress and goals.`;
    const prompt = `Learner Data: ${JSON.stringify(contextData)}`;
    const result = await this.callAI(prompt, systemInstruction, true);
    return JSON.parse(result);
  }
}

module.exports = new MentorAIService();