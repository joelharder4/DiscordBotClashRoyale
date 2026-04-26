const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { completionWithSystemPrompt } = require('../../services/chatgpt');
const { britishAccentPrompt } = require('../../utils/chatGPTPrompts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription("The bot will repeat the message you provide. Any Bri'ish translations are purely coincidental.")
        .addStringOption((option) =>
			option.setName('message')
				.setDescription('The message the bot will repeat.')
				.setRequired(true)),

    async execute(interaction, client) {
        
        const inputMessage = interaction.options.getString('message');
        let message = inputMessage;

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const chanceOfBritish = Math.floor(Math.random() * 5);
        if (chanceOfBritish === 0) {
            // get chatGPT to translate it to bri'ish
            const gptResponse = await completionWithSystemPrompt(inputMessage, britishAccentPrompt);
            if (gptResponse?.choices?.[0]?.message?.content) {
                message = gptResponse.choices[0].message.content;
            }
        }

        await interaction.deleteReply();
        await interaction.channel.send(message); 
    },
};