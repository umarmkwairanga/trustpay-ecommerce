const { OpenAI } = import('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Translates text into the target Nigerian language.
 * @param {string} text - The input text.
 * @param {string} targetLang - 'yoruba', 'igbo', or 'hausa'.
 */
exports.getTranslation = async (text, targetLang) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // or "gpt-3.5-turbo" for lower cost
      messages: [
        {
          role: "system",
          content: `You are an expert translator specializing in Nigerian languages. Translate the following text accurately into ${targetLang}. Provide ONLY the translation.`
        },
        { role: "user", content: text }
      ],
      temperature: 0.3,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Translation request failed");
  }
};