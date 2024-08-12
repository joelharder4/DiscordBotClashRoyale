const axios = require('axios');
const { openAIKey } = process.env;
const logger = require('../utils/logger');
const { OpenAI } = require("openai");

const client = new OpenAI({
    apiKey: openAIKey,
});


const completionWithoutSystemPrompt = async (message) => {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        messages: [{"role": "user", "content": message}],
        temperature: 1.0
    }, {
        headers: {
            Authorization: `Bearer ${openAIKey}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data;
}


const completionWithSystemPrompt = async (userMessage, systemPrompt) => {
    const response = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-4o-mini",
        messages: [
            {"role": "system", "content": systemPrompt},
            {"role": "user", "content": userMessage}
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




const completionWithStructuredOutput = async (userMessage, systemMessage, schema) => {
    try {
        const chatCompletion = await client.beta.chat.completions.parse({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userMessage },
            ],
            response_format: {
                type: "json_schema",
                json_schema: schema,
            },
        });

        console.log(chatCompletion.choices[0].message);
        return chatCompletion;
    } catch(err) {
        logger.error(`completionWithStructuredOutput: ${err}`);
    }
}


module.exports = {
    completionWithoutSystemPrompt,
    completionWithSystemPrompt,
    completionWithStructuredOutput,
};