const { SlashCommandBuilder, bold, heading, italic } = require('discord.js');
const { table } = require('table');
const { getRiverRaceLog } = require('../../services/clashRoyaleAPI');


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

        const war = await getRiverRaceLog(clanTag);
        const participants = war.clan.participants.reverse();
        // const latestParticipants = latestStandings[1].clan.participants;

        // console.log(JSON.stringify(war, null, 2));
        console.log(war);
        console.log(participants);
        // console.log(latestParticipants);

        const dataTable = [
            ['Player', 'Medals', 'Decks', 'Medals/Deck', 'Boat Attacks'],
        ];

        let name = "";
        let fame = "";
        let decksUsedToday = "";
        let famePerDeck = "";
        let boatAttacks = "";

        for (const player of participants) {
            name = player.name;
            fame = player.fame.toString();
            decksUsedToday = (4 - player.decksUsedToday).toString();
            famePerDeck = "N/A";
            if (player.decksUsed) {
                famePerDeck = Math.round(player.fame / player.decksUsed).toString();
            }
            boatAttacks = player.boatAttacks.toString();

            dataTable.push([name, fame, decksUsedToday, famePerDeck, boatAttacks]);
        }

        const config = {
            drawHorizontalLine: (lineIndex, rowCount) => {
                return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount;
            },
        };

        // console.log(table(dataTable, config));
        const message = `${heading("Current War Summary")}\n${bold(war.clan.name)} | ${bold(italic("War Day"))}\`\`\`${table(dataTable, config)}\`\`\``;

        await interaction.reply({
            content: message,
        })
    },
};