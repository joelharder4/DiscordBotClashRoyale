const { openAIKey } = process.env;
const logger = require('../utils/logger');
const { OpenAI } = require("openai");

const client = new OpenAI({
    apiKey: openAIKey,
});


const completionWithoutSystemPrompt = async (message) => {
    try {
        const chatCompletion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "user", content: message },
            ],
            temperature: 1.0,
        });

        return chatCompletion;
    } catch(err) {
        logger.error(`completionWithStructuredOutput: ${err}`);
    }
}


const completionWithSystemPrompt = async (userMessage, systemMessage) => {
    try {
        const chatCompletion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userMessage },
            ],
            temperature: 1.0,
        });

        return chatCompletion;
    } catch(err) {
        logger.error(`completionWithStructuredOutput: ${err}`);
    }
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