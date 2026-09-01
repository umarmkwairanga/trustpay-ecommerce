import axios from 'axios';

// We will load this from your .env file
const INDIGENIUS_API_KEY = process.env.INDIGENIUS_API_KEY;

async function getVoiceTranslation(text, language = 'yoruba') {
    try {
        const response = await axios.post('https://api.indigenius.ai/v1/tts', {
            text: text,
            language: language,
            voice_style: 'natural' // Ensuring it sounds like a local speaker
        }, {
            headers: { 
                'Authorization': `Bearer ${INDIGENIUS_API_KEY}`,
                'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer' // We need the audio data
        });
        
        return response.data; // This is the binary audio data
    } catch (error) {
        console.error("Indigenius Voice Error:", error.message);
        throw error;
    }
}

export default { getVoiceTranslation };