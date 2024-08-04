const { SlashCommandBuilder, heading, bold } = require('discord.js');
const { getPlayer } = require('../../services/clashRoyaleAPI');
const { cardLevelTable } = require('../../utils/clashRoyaleTables');
const PlayerTag = require('../../schemas/playerTag');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('player')
        .setDescription('Displays information about a player.')
        .addStringOption((option) =>
			option.setName('playertag')
				.setDescription('The player tag of the player. (Default is Yourself)')
				.setRequired(false)),

    async execute(interaction, client) {

        const userPlayerProfile = await PlayerTag.findOne({ userId: interaction.user.id });
        const playerTagOption = interaction.options.getString('playertag');

        if (!userPlayerProfile && !playerTagOption) {
            await interaction.reply({
                content: `You must either provide a player tag in the command, or set a default player tag for yourself using \`/setplayertag\`!`,
                ephemeral: true,
            });
            return;
        }
        
        const playerTag = playerTagOption ?? userPlayerProfile.playerTag;

        const player = await getPlayer(playerTag);

        if (!player) {
            await interaction.reply({
                content: `Could not find a player with the tag \`#${playerTag}\`!`,
                emphemeral: true,
            });
            return;
        }

        const cardLevels = await cardLevelTable(player.cards);

        const leagueNames = {
            1: "Challenger I",
            2: "Challenger II",
            3: "Challenger III",
            4: "Master I",
            5: "Master II",
            6: "Master III",
            7: "Champion",
            8: "Grand Champion",
            9: "Royal Champion",
            10: "Ultimate Champion",
        };

        let message = `${heading(player.name)}\n`;
        message += `**${player.tag}** | **Lvl ${player.expLevel}**\n`;
        message += `Clan: **${player.clan.name}** \`${player.clan.tag}\`\n`;
        message += `Trophies: **${player.trophies}**\n`;
        message += `Best Trophies: **${player.bestTrophies}**\n`;
        message += `Legacy Best Trophies: **${player.legacyTrophyRoadHighScore}**\n`;
        message += `Battles Played: **${player.battleCount}**\n`;
        message += `Battles Won: **${player.wins}**\n`;
        message += `3-Crown Wins: **${player.threeCrownWins}**\n`;
        message += `Losses: **${player.losses}**\n`;
        // message += `War Day Wins: ${player.warDayWins}\n`; // this probably refers to the the number of river race wins
        message += `Cards Found: **${player.cards.length} of 115 (${100 * Math.round(player.cards.length / 115)}%)**\n`;
        message += `Total Donations:  **${player.totalDonations}**\n`;
        message += `Donations Received: **${player.donationsReceived}**\n`;
        message += `Current Favourite Card: **${player.currentFavouriteCard.name}**\n`;
        message += `### Path of Legends:\n`;
        message += ` This Season: **${leagueNames[player.currentPathOfLegendSeasonResult.leagueNumber]}**\n`;
        message += ` Last Season: **${leagueNames[player.lastPathOfLegendSeasonResult.leagueNumber]}**\n`;
        message += ` Best Season: **${leagueNames[player.bestPathOfLegendSeasonResult.leagueNumber]}**\n`;
        message += `### Goblin Queen's Journey:\n`;
        message += ` Trophies: **${player.progress['goblin-road'].trophies}**\n`;
        message += ` Best Trophies: **${player.progress['goblin-road'].bestTrophies}**\n`;

        message += `\n**Card Levels**\n`;

        message += `\`\`\`${cardLevels}\`\`\``;

        await interaction.reply({
            content: message,
        });
    },
};