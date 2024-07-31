const Challenge = require('../../schemas/challenge');
const { isDateOlderThanXHours, isDateOlderThanXDays } = require('../../utils/time');

module.exports = {
    name: 'clean-challenges',
    // detailed schedule info: https://www.npmjs.com/package/node-schedule
    // 'second (optional) minute hour dayofmonth month dayofweek'
    // runs at midnight every night
    schedule: '0 0 * * *',
    async execute(client) {
        console.log('executing clean-challenges job');

        // Retrieve all entries in the database
        const ChallengesArray = await Challenge.find({});

        ChallengesArray.forEach( async (challenge) => {

            /*
                pending: remove if older than 24 hours
                declined: remove if older than 24 hour
                ongoing: remove if older than 30 days because something likely went wrong
                completed: never remove
            */

            switch (challenge.status) {

                case "pending":
                    if (isDateOlderThanXHours(challenge.startTime, 24)) {
                        await Challenge.findByIdAndDelete(challenge._id);
                    }
                    break;
                
                case "declined":
                    if (isDateOlderThanXHours(challenge.startTime, 1)) {
                        await Challenge.findByIdAndDelete(challenge._id);
                    }
                    break;
                
                case "ongoing":
                    if (isDateOlderThanXDays(challenge.startTime, 30)) {
                        await Challenge.findByIdAndDelete(challenge._id);
                    }
                    break;

                default:
                    break;
            }
        });
    },
};