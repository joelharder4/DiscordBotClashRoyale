const { SlashCommandBuilder } = require('discord.js');
const chalk = require('chalk');
const { deckTable } = require('../../utils/clashRoyaleTables');
const { deckGeneratorPrompt } = require('../../utils/chatGPTPrompts');
const { completionWithSystemPrompt } = require('../../services/chatgpt');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('newdeck')
        .setDescription('Get ChatGPT to Generate a Clash Royale deck based on any theme you want.')
        .addStringOption((option) =>
			option.setName('theme')
				.setDescription('The theme of the deck you want to generate. You can say anything you want.')
				.setRequired(false)),

    async execute(interaction, client) {

        let theme = "The user wants you to generate a deck based on this theme:\n";
        theme += interaction.options.getString('theme') ?? "There is no theme.";

        await interaction.deferReply();

        const gptResponse = await completionWithSystemPrompt(theme, deckGeneratorPrompt);
        let deck = {};

        try {
            deck = JSON.parse(gptResponse.choices[0].message.content);

        } catch(err) {
            console.log(chalk.red(`[Error]: Failed to convert GPT Generated deck into JSON format.\n`), err);

            await interaction.editReply({
                content: `Sorry, something went wrong but it's not your fault. Please try again!`,
            });
            return;
        }

        let totalElixir = 0;
        deck.cards.forEach(card => totalElixir += card.cost);

        const cardTable = await deckTable(deck.cards);

        let message = `## ${deck.name}\n`;
        message += `### Description\n`;
        message += `${deck.description}\n`;
        message += `### Strategy\n`;
        message += `${deck.strategy}\n\n`;
        message += `\`\`\`${cardTable}\`\`\`\n`;
        message += `**${Math.round((totalElixir / 8) * 10) / 10} <:elixir:1269054563424669818> Average Elixir Cost**\n`;
        

        await interaction.editReply({
            content: message,
        })
    },
};