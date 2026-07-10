// backend/services/languageService.js
const axios = import('axios');

const INDIGENIUS_API_KEY = process.env.INDIGENIUS_API_KEY; 

async function translateToLocal(text, targetLang) {
    // targetLang could be 'yoruba', 'igbo', 'hausa'
    try {
        const response = await axios.post('https://api.indigenius.ai/v1/translate', {
            text: text,
            target_language: targetLang
        }, {
            headers: { 'Authorization': `Bearer ${INDIGENIUS_API_KEY}` }
        });
        return response.data.translatedText;
    } catch (error) {
        console.error("Translation failed:", error.message);
        throw error;
    }
}