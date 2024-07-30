const chalk = require('chalk');
const PrimaryChannels = require('../../schemas/primaryChannels');
const { getFormattedTimeString } = require('../../utils/formattedTime');

module.exports = {
    name: 'daily-war-summary',
    // schedule: 'second (optional) minute hour dayofmonth month dayofweek'
    schedule: '0 * * * * *',
    async execute(client, guildId) {
        const primaryChannelProfile = await PrimaryChannels.findOne({ guildId: guildId });

        if (!primaryChannelProfile) {
            console.error(chalk.red(`[Event] daily-war-summary: Primary channel not set for guild ${guildId}`));
            return;
        }

        const channel = client.channels.cache.get(primaryChannelProfile.channelId);

        const now = new Date();;
        const localTime = getFormattedTimeString(now);
        const utcTime = getFormattedTimeString(new Date(now.getTime() + (now.getTimezoneOffset() * 60000)));

        channel.send(`Holay Molay it's ${localTime} local time and ${utcTime} UTC time!`);



        
    }
}