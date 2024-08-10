const { SlashCommandBuilder } = require('discord.js');
const { sendLongMessage } = require('../../utils/longMessage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Gives more detailed information about some commands and features.'),

    async execute(interaction, client) {

        let message = `## CORBot Help\n`;
        message += `### Configuration Commands\n`;
        message += `- \`/setclan {clanTag (required)}\` - Sets the clan tag for the server. The bot uses this clan tag as the default for clan-related commands inside of this discord server. It is also used in order to gather information about the clan for automatic clan war updates. Once it is set, it will remain in the database until it is replaced. The clan tag must not include the # at the beginning.\n`;
        message += `- \`/setchannel {discordChannel (required)}\` - Sets the bot's primary channel for the server. The bot will send any automatic scheduled messages in this channel. It must be set in order to receive automatic clan war updates.\n`;
        message += `- \`/setplayertag {playerTag (required)}\` - Sets the player tag for whoever uses the command. The bot uses this player tag as the default for player-related commands inside of this discord server. Once it is set, it will remain in the database until it is replaced and it is unique for each discord server. The player tag must not include the # at the beginning.\n`;
        message += `- \`/dailywarupdate\` - Toggles the daily war update message. If it is enabled, the bot will send a message in the set channel every day with results from the previous day's clan war. If it is disabled, the bot will not send the message. It is **disabled** by default.\n`;

        message += `### Clash Royale Info Commands\n`;
        message += `- \`/clan {clanTag (optional)}\` - Displays general information about the given clan. It includes the clan's name, description, members, etc. If no clanTag is provided, it will use the server's default clan which is set with \`/setclan\`.\n`;
        message += `- \`/player {playerTag (optional)}\` - Displays general information about the given player. It includes the player's name, wins, trophies, etc. If no playerTag is provided, it will use the user's default playerTag in this server which is set with \`/setplayertag\`.\n`;
        message += `- \`/war {clanTag (optional)}\` - Displays information about the current clan war. It includes the participants' medals, decks used, etc. If no clanTag is provided, it will use the server's default clan which is set with \`/setclan\`.\n`;

        message += `### Role Shuffle\n`;
        message += `The role shuffle occurs once a week at the end of a clan war. You can get promoted, demoted, or stay the same based on the number of medals you have earned relative to your clan members\n`;
        message += `- \`/roleshuffle\` - Toggles your participation in the role shuffle game. It is opt-in which means you are **not** included by default. In order for it to start working, the server must have more than 2 participants who all have configured their player tag using \`/setplayertag\` along with a clan tag and primary channel set for this server.\n\n`;
        message += `**Rules:**\n`;
        message += `1. The player(s) with the lowest war score that has played at least one game always gets demoted, unless they are the current Leader.\n`;
        message += `2. If a player is going to get demoted but they are already a member then nothing happens to them, but they do get publicly humiliated.\n`;
        message += `3. The player(s) with the most medals earned always get promoted, unless they are Leader/Co-Leader. Rule 4 explains how Co-Leaders get promoted\n`;
        message += `4. For a Co-Leader to become Leader, they have to get the most medals for two consecutive weeks and they must be the sole winner for the second one (if it is a tir for the second one, it doesn't count).\n`;
        message += `5. If somehow all players are tied, nothing happens\n`;

        await sendLongMessage(interaction.channel, message);
    },
};