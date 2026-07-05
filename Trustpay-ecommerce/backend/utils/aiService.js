const { OpenAI } = import('openai');

// Initialize the client
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Translates text to a specified language.
 * @param {string} text - The content to translate.
 * @param {string} targetLanguage - The language (e.g., 'Yoruba', 'Igbo', 'Hausa').
 */
exports.translateText = async (text, targetLanguage) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: `You are a professional translator for a financial platform. Translate the following text into ${targetLanguage}. Maintain a professional and trustworthy tone.` 
        }, 
        { 
          role: "user", 
          content: text 
        }
      ]
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Translation Error:", error);
    // Return original text if translation fails to prevent UI breakage
    return text; 
  }
};