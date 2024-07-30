const { SlashCommandBuilder, bold, heading } = require('discord.js');
const { getCurrentRiverRace } = require('../../services/clashRoyaleAPI');
const { currentRiverRaceTable } = require('../../utils/clashRoyaleTables');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('war')
        .setDescription('Displays the current war situation for the clan.')
        .addStringOption((option) =>
			option.setName('clantag')
				.setDescription('The clan tag of the clan to display. (Default is Glacier 2)')
				.setRequired(false)),

    async execute(interaction, client) {

        const clanTagOption = interaction.options.getString('clantag');
        const clanTag = clanTagOption ?? 'G88J9CVP'; // Glacier 2 clan tag

        const war = await getCurrentRiverRace(clanTag);
        const asciiTable = await currentRiverRaceTable(war);

        const periodType = war.periodType;
        let dayType;

        if (periodType.toLowerCase() == "training") {
            dayType = "Training Day";
        } else if (periodType.toLowerCase() == "war_day") {
            dayType = "Battle Day";
        } else if (periodType.toLowerCase() == "colosseum") {
            dayType = "Colosseum";
        }
        
        const message = `${heading("Current War Summary")}\n${bold(war.clan.name)} | ${bold(dayType)}\`\`\`${asciiTable}\`\`\``;

        await interaction.reply({
            content: message,
        })
    },
};