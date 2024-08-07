const PrimaryChannels = require('../../schemas/primaryChannels');
const Player = require('../../schemas/playerTag');
const Clan = require('../../schemas/clanTag');
const ClanWarWeek = require('../../schemas/clanWarWeek');
const RoleShuffle = require('../../schemas/roleShuffle');
const ShuffleParticipant = require('../../schemas/shuffleParticipant');
const { isDateOlderThanXDays } = require('../../utils/time');
const logger = require('../../utils/logger');
const mongoose = require('mongoose');

module.exports = {
    name: 'weekly-role-shuffle',
    // detailed schedule info: https://www.npmjs.com/package/node-schedule
    // 'second (optional) minute hour dayofmonth month dayofweek'
    // IMPORTANT: new battle day starts at 5:34am EST?
    //            and wars go from monday to sunday 5:34am
    schedule: '0 0 12 * * 1', // = 12:00:00pm on Monday
    async execute(client) {
        
        const primaryChannels = await PrimaryChannels.find({});
        primaryChannels.forEach( async (channelProfile) => {

            const guildId = channelProfile.guildId;
            if (client.testMode && guildId !== client.testGuildId) return;

            const clanProfile = await Clan.findOne({ guildId: guildId });
            if (!clanProfile) {
                logger.warn(`Event ${this.name}: Default clan tag not set for guild ${guildId} but job is still enabled!`);
                return;
            }

            // get the most recent clan war summary
            const clanWarWeekProfile = await ClanWarWeek.findOne({ clanTag: clanProfile.clanTag }, null, { sort: { date: -1 } });
            if (!clanWarWeekProfile) {
                logger.warn(`Event ${this.name}: There is no recorded Clan War Table for clan ${clanProfile.clanTag}!`);
                return;
            }

            const roleShuffleParticipants = [];
            for (const member of clanWarWeekProfile.participants) {
                // use the player tag to find the userId
                const playerProfile = await Player.findOne({ playerTag: member.playerTag });
                if (!playerProfile) {
                    continue;
                }

                const shuffleProfile = await ShuffleParticipant.findOne({ userId: playerProfile.userId, guildId: guildId });
                if (!shuffleProfile) {
                    continue;
                }

                if (shuffleProfile.optedIn) {
                    roleShuffleParticipants.push(member);
                }
            }

            // there must be more than 1 person participating
            if (roleShuffleParticipants.length <= 1) {
                logger.info(`Event ${this.name}: Not enough role shuffle participants in clan ${clanProfile.clanTag}!`);
                return;
            }

            let highestFamePlayers = [];
            let lowestFamePlayers = [];

            roleShuffleParticipants.forEach( async (participant) => {

                if (highestFamePlayers.length === 0) {
                    highestFamePlayers.push(participant);
                    lowestFamePlayers.push(participant);
                    return;
                }

                if (participant.fame > highestFamePlayers[0].fame) {
                    highestFamePlayers = [participant];

                } else if (participant.fame === highestFamePlayers[0].fame) {
                    highestFamePlayers.push(participant);
                }

                if (participant.fame < lowestFamePlayers[0].fame && participant.fame > 0) {
                    lowestFamePlayers = [participant];
                } else if (participant.fame === lowestFamePlayers[0].fame) {
                    lowestFamePlayers.push(participant);
                }

            });

            const channel = client.channels.cache.get(channelProfile.channelId);
            const now = new Date();
            let message = `## Role Shuffle\n`;

            if (highestFamePlayers.length === roleShuffleParticipants.length) {
                channel.send(message + `Every participant in the role shuffle has exactly ${highestFamePlayers[0].fame} score in the clan war! Since everyone is tied, no role changes will be made.`);
                return;
            }

            message += `### The **most skilled** player(s) who got ${highestFamePlayers[0].fame} medals:\n`;

            for (const participant of highestFamePlayers) {
                const role = participant.role.toLowerCase();
                const name = participant.name;

                if (role === 'member') {
                    message += `- **${name}**, who will get promoted to **Elder**! <a:yippee:1269827923985305658>\n`;

                } else if (role === 'elder') {
                    message += `- **${name}**, who will get promoted to **Co-Leader**! <a:yippee:1269827923985305658>\n`;

                } else if (role === 'coleader') {

                    const roleShuffleProfile = await RoleShuffle.findOne({ playerTag: participant.playerTag }, null, { sort: { date: -1 } });
                    let shuffleDate = now;
                    let highestFame = false;

                    if (roleShuffleProfile) {
                        shuffleDate = roleShuffleProfile.date;
                        highestFame = roleShuffleProfile.highestFame;
                    }

                    if (isDateOlderThanXDays(shuffleDate, 8)) {
                        logger.warn(`Event ${this.name}: Role shuffle profile for player ${participant.playerTag} in clan ${clanProfile.clanTag} is too old! Assuming they did not win last week.`);
                        highestFame = false;
                    }

                    // if they won last week
                    if (highestFame && highestFamePlayers.length === 1) {
                        message += `- **${name}**, who is currently **Co-Leader**! Since this is the second consecutive win for them, they will be promoted to **Leader**. All Hail ${name}! <a:yippee:1269827923985305658>\n`;
                    
                    } else if (highestFame && highestFamePlayers.length > 1) {
                        message += `- **${name}**, who is currently **Co-Leader**! They also won last week but unfortunately for them, it ended in a tie, so they wont be getting promoted <:mimimimimi:1266131684529537065>. However, they keep their chance to become Leader if they win again next week!\n`;

                    } else {
                        message += `- **${name}**, who is currently **Co-Leader**! In order to become Leader, the rules state that you have to win 2 consecutive weeks. If ${name} can squeak out a win again next week, they'll become the new Leader! <a:yippee:1269827923985305658>\n`;
                    }

                    // mark in the datebase that they won the role shuffle this week
                    const newRoleShuffleProfile = new RoleShuffle({
                        _id: new mongoose.Types.ObjectId(),
                        playerTag: participant.playerTag,
                        highestFame: true,
                        lowestFame: false,
                        date: now,
                    });
                    newRoleShuffleProfile.save().catch(console.error);

                } else if (role === 'leader') {

                    // TODO: change this messsage to a ChatGPT response
                    message += `- **${name}**, who is already the **Leader**! Everyone wants to be like ${name} because they are so cool and the best gamer to ever live. <a:yippee:1269827923985305658><a:yippee:1269827923985305658><a:yippee:1269827923985305658>\n`;

                }
            }




            message += `\n### The **most cooked** player(s) who only got **${lowestFamePlayers[0].fame} medals**:\n`;

            for (const participant of lowestFamePlayers) {
                const role = participant.role.toLowerCase();
                const name = participant.name;

                if (role === 'member') {
                    // TODO: Change this to a ChatGPT response
                    message += `- 💀 **${name}** 💀 who will be demoted to **Member**! Oh, wait. They're already a member... Laugh at this user! They're Joever. 💀\n`;

                } else if (role === 'elder') {
                    message += `- 💀 **${name}** 💀 who will be demoted to **Member**! 💀\n`;

                } else if (role === 'coleader') {
                    message += `- 💀 **${name}** 💀 who will be demoted to **Elder**! 💀\n`;

                } else if (role === 'leader') {
                    // TODO: Change this to a ChatGPT response
                    message += `- 💀 **${name}** 💀 who is currently the **Leader**! Honestly, how did they fall off so hard? It's kinda cringe tbh and they should be ashamed. Someone has to replace them ASAP but I wouldn't be suprised if they demoted themselves out of shame. <:mimimimimi:1266131684529537065><:mimimimimi:1266131684529537065><:mimimimimi:1266131684529537065>\n`;

                    // mark in the datebase that they won the role shuffle this week
                    const roleShuffleProfile = new RoleShuffle({
                        _id: new mongoose.Types.ObjectId(),
                        playerTag: participant.playerTag,
                        highestFame: false,
                        lowestFame: true,
                        date: now,
                    });
                    roleShuffleProfile.save().catch(console.error);
                }
            }

            channel.send(message);
        });

    }
}