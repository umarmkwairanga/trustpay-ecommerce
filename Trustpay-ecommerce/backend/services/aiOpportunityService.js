const axios = require('axios');

class AIOpportunityService {
  constructor() {
    this.apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  }

  async analyzeProfileAndMatch(profile, jobs) {
    if (!this.apiKey) {
      // Fallback response if AI key is not configured
      return jobs.map(job => ({
        jobId: job._id,
        matchScore: 75,
        matchingSkills: job.requiredSkills.slice(0, 2),
        missingSkills: job.requiredSkills.slice(2),
        recommendation: 'Complete standard training modules to boost matching score.'
      }));
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const prompt = `Analyze job seeker profile and return structured JSON array matching each job with:
      - jobId (string)
      - matchScore (0-100 number)
      - matchingSkills (array)
      - missingSkills (array)
      - recommendation (string)

      Profile: ${JSON.stringify(profile)}
      Jobs: ${JSON.stringify(jobs)}`;

      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      });

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return JSON.parse(text);
    } catch (error) {
      console.error('AI Opportunity Matching Error:', error.message);
      return [];
    }
  }
}

module.exports = new AIOpportunityService();