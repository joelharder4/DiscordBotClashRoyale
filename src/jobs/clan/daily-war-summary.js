const chalk = require('chalk');
const PrimaryChannels = require('../../schemas/primaryChannels');
const { getCurrentRiverRace } = require('../../services/clashRoyaleAPI');
const { currentRiverRaceTable } = require('../../utils/clashRoyaleTables');
const { heading, bold } = require('discord.js');

module.exports = {
    name: 'daily-war-summary',
    // schedule: 'second (optional) minute hour dayofmonth month dayofweek'
    schedule: '0 0 * * * *',
    async execute(client, guildId) {
        const primaryChannelProfile = await PrimaryChannels.findOne({ guildId: guildId });

        if (!primaryChannelProfile) {
            console.error(chalk.red(`[Event]: daily-war-summary: Primary channel not set for guild ${guildId}`));
            return;
        }

        // TODO: Implement a way to get the clan tag from the database
        const clanTag = 'G88J9CVP'; // Glacier 2 clan tag
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

        const channel = client.channels.cache.get(primaryChannelProfile.channelId);
        channel.send(message);
    }
}