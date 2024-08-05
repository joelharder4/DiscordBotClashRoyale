const { SlashCommandBuilder } = require('discord.js');
const { completionWithSystemPrompt } = require('../../services/chatgpt');
const { britishAccentPrompt } = require('../../utils/chatGPTPrompts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription("The bot will repeat the message you provide. Any accidental Bri'ish translations are purely coincidental.")
        .addStringOption((option) =>
			option.setName('message')
				.setDescription('The message the bot will repeat.')
				.setRequired(true)),

    async execute(interaction, client) {
        
        const inputMessage = interaction.options.getString('message');
        let message = inputMessage;

        interaction.deferReply({ ephemeral: true });

        const chanceOfBritish = Math.floor(Math.random() * 3) + 1;
        if (chanceOfBritish === 1) {
            // get chatGPT to translate it to bri'ish
            const gptResponse = await completionWithSystemPrompt(inputMessage, britishAccentPrompt);
            message = gptResponse.choices[0].message.content;
        }

        interaction.deleteReply();
        interaction.channel.send(message);
    },
};