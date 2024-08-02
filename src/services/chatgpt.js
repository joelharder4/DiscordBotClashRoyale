const axios = require('axios');
const { openAIKey } = process.env;



const completionWithoutSystemPrompt = async (message) => {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        messages: [{"role": "user", "content": message}],
        temperature: 0.7
    }, {
        headers: {
            Authorization: `Bearer ${openAIKey}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data;
}


const completionWithSystemPrompt = async (message, systemPrompt) => {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        messages: [
            {"role": "system", "content": systemPrompt},
            {"role": "user", "content": message}
        ],
        temperature: 1.0
    }, {
        headers: {
            Authorization: `Bearer ${openAIKey}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data;
}



module.exports = {
    completionWithoutSystemPrompt,
    completionWithSystemPrompt,
};