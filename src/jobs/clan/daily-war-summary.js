const chalk = require('chalk');
const PrimaryChannels = require('../../schemas/primaryChannels');
const EnabledJobs = require('../../schemas/enabledJobs');
const Clan = require('../../schemas/clanTag');
const ClanWarDay = require('../../schemas/clanWarDay');
const { clanWarDayTable } = require('../../utils/clashRoyaleTables');
const { getCurrentTimeString } = require('../../utils/time');
const { heading, bold } = require('discord.js');

module.exports = {
    name: 'daily-war-summary',
    // detailed schedule info: https://www.npmjs.com/package/node-schedule
    // 'second (optional) minute hour dayofmonth month dayofweek'
    // IMPORTANT: new battle day starts at 5:34am EST?
    schedule: '0 0 12 * * *', // = noon every day
    async execute(client) {
        // Retrieve all entries in the database
        const enabledJobsArray = await EnabledJobs.find({});

        // Loop through all guildIds
        enabledJobsArray.forEach( async (enabledJobs) => {

            const guildId = enabledJobs.guildId;

            if (!enabledJobs.jobNames.includes(this.name)) {
                console.log(`Job '${this.name}' is disabled in guild ${guildId}`);
                return;
            }
            
            const [primaryChannelProfile, guildClanProfile] = await Promise.all([
                PrimaryChannels.findOne({ guildId: guildId }),
                Clan.findOne({ guildId: guildId })
            ]);

            if (!primaryChannelProfile) {
                console.error(`${getCurrentTimeString()}   ` + chalk.red(`[Error] Event ${this.name}: Primary channel not set for guild ${guildId} but job is still enabled!`));
                return;
            }
            if (!guildClanProfile) {
                console.error(`${getCurrentTimeString()}   ` + chalk.red(`[Error] Event ${this.name}: Default clan tag not set for guild ${guildId} but job is still enabled!`));
                return;
            }

            const clanTag = guildClanProfile.clanTag;
            const war = await ClanWarDay.findOne({ clanTag: clanTag });
            const asciiTable = await clanWarDayTable(war);

            const periodType = war.periodType;
            let dayType;

            const today = new Date();
            let dayNum = today.getDay();
            switch (dayNum) {
                case 0:
                    dayNum = 4;
                    break;
                case 4, 5, 6:
                    dayNum = dayNum - 3;
                    break;
                default:
                    break;
            }

            if (periodType.toLowerCase() == "training") {
                dayType = "Training Day";
            } else if (periodType.toLowerCase() == "war_day") {
                dayType = "Battle Day";
            } else if (periodType.toLowerCase() == "colosseum") {
                dayType = "Colosseum";
            }

            const message = `${heading("War Summary for Yesterday")}\n${bold(war.clanName)} | ${bold(dayType)} ${bold(dayNum)}\`\`\`${asciiTable}\`\`\``;

            const channel = client.channels.cache.get(primaryChannelProfile.channelId);
            channel.send(message);
        });

        console.log(`${getCurrentTimeString()}   ` + chalk.green(`[Running] Job ${this.name}: Started job`));
    }
}