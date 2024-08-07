const { SlashCommandBuilder } = require('discord.js');
const { clashRoyaleJokesPrompt, canadianJokesPrompt } = require('../../utils/chatGPTPrompts');
const { completionWithSystemPrompt } = require('../../services/chatgpt');
const logger = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('Get the bot to tell a really funny joke.'),

    async execute(interaction, client) {

        await interaction.deferReply();

        let jokePrompt;
        if (Math.floor(Math.random() * 2) === 0) {
            jokePrompt = clashRoyaleJokesPrompt;
        } else {
            jokePrompt = canadianJokesPrompt;
        }

        const gptResponse = await completionWithSystemPrompt("tell me a joke", jokePrompt);

        await interaction.editReply({
            content: gptResponse.choices[0].message.content,
        });
    },
};