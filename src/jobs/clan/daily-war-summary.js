const chalk = require('chalk');
const PrimaryChannels = require('../../schemas/primaryChannels');
const EnabledJobs = require('../../schemas/enabledJobs');
const Clan = require('../../schemas/clanTag');
const { getCurrentRiverRace } = require('../../services/clashRoyaleAPI');
const { currentRiverRaceTable } = require('../../utils/clashRoyaleTables');
const { heading, bold } = require('discord.js');

module.exports = {
    name: 'daily-war-summary',
    // detailed schedule info: https://www.npmjs.com/package/node-schedule
    // 'second (optional) minute hour dayofmonth month dayofweek'
    // IMPORTANT: new battle day starts at 5:34am EST?
    schedule: '0 1 * * * *',
    async execute(client) {
        // Retrieve all entries in the database
        const enabledJobsArray = await EnabledJobs.find({});

        // Loop through all guildIds
        enabledJobsArray.forEach( async (jobs) => {

            const guildId = jobs.guildId;

            if (jobs.jobNames.includes(this.name)) {
                
                // execute the job for this guild
                const primaryChannelProfile = await PrimaryChannels.findOne({ guildId: guildId });

                if (!primaryChannelProfile) {
                    console.error(chalk.red(`[Error] Event daily-war-summary: Primary channel not set for guild ${guildId} but job is still enabled!`));
                    return;
                }

                const guildClanProfile = await Clan.findOne({ guildId: guildId });

                if (!guildClanProfile) {
                    console.error(chalk.red(`[Error] Event daily-war-summary: Default clan tag not set for guild ${guildId} but job is still enabled!`));
                    return;
                }

                const clanTag = guildClanProfile.clanTag;
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

            } else {
                console.log(`Job '${this.name}' is disabled in guild ${guildId}`);
            }
        });
    }
}