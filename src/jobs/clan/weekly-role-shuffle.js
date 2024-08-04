const chalk = require('chalk');
const PrimaryChannels = require('../../schemas/primaryChannels');
const Player = require('../../schemas/playerTag');
const Clan = require('../../schemas/clanTag');
const ClanWarWeek = require('../../schemas/clanWarWeek');
const RoleShuffle = require('../../schemas/roleShuffle');
const { getCurrentTimeString, isDateOlderThanXDays } = require('../../utils/time');
const mongoose = require('mongoose');

module.exports = {
    name: 'weekly-role-shuffle',
    // detailed schedule info: https://www.npmjs.com/package/node-schedule
    // 'second (optional) minute hour dayofmonth month dayofweek'
    // IMPORTANT: new battle day starts at 5:34am EST?
    //            and wars go from monday to sunday 5:34am
    schedule: '0 0 12 * * 1', // = 12:00:00pm on Monday
    async execute(client) {

        // TODO: test this job with multiple users
        
        const primaryChannels = await PrimaryChannels.find({});
        primaryChannels.forEach( async (channelProfile) => {

            const guildId = channelProfile.guildId;

            const clanProfile = await Clan.findOne({ guildId: guildId });
            if (!clanProfile) {
                console.error(`${getCurrentTimeString()}   ` + chalk.yellow(`[Warning] Event weekly-role-shuffle: Default clan tag not set for guild ${guildId} but job is still enabled!`));
                return;
            }

            // get the most recent clan war summary
            const clanWarWeekProfile = await ClanWarWeek.findOne({ clanTag: clanProfile.clanTag }, null, { sort: { date: -1 } });
            if (!clanWarWeekProfile) {
                console.error(`${getCurrentTimeString()}   ` + chalk.yellow(`[Warning] Event weekly-role-shuffle: There is no recorded Clan War Table for clan ${clanProfile.clanTag}!`));
                return;
            }

            const roleShuffleParticipants = [];
            for (const member of clanWarWeekProfile.participants) {
                const playerProfile = await Player.findOne({ playerTag: member.playerTag });
                if (!playerProfile) {
                    // this just means that the player has not set their player tag using /setplayertag
                    continue;
                }

                if (playerProfile.roleShuffleParticipant) {
                    roleShuffleParticipants.push(playerProfile);
                }
            }

            // there must be more than 1 person participating
            if (roleShuffleParticipants.length <= 1) {
                console.error(`${getCurrentTimeString()}   ` + chalk.yellow(`[Info] Event weekly-role-shuffle: Not enough role shuffle participants in clan ${clanProfile.clanTag}!`));
                return;
            }

            const highestFamePlayers = [];
            const lowestFamePlayers = [];
            const leaderIsHighest = false;

            roleShuffleParticipants.forEach( async (participant) => {

                if (highestFamePlayers.length === 0) {
                    highestFamePlayers.push(participant);
                    lowestFamePlayers.push(participant);
                    return;
                }

                if (participant.fame > highestFamePlayers[0].fame) {
                    highestFamePlayers = [participant];
                    leaderIsHighest = participant.role.toLowerCase() === 'leader';

                } else if (participant.fame === highestFamePlayers[0].fame) {
                    highestFamePlayers.push(participant);
                    leaderIsHighest = participant.role.toLowerCase() === 'leader' ?? leaderIsHighest;
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

            message += `The **most omega humamongus skilled** player(s) who got ${highestFamePlayers[0].fame} medals in the clan war this week:\n`;

            highestFamePlayers.forEach( async (participant) => {
                const role = participant.role.toLowerCase();
                const name = participant.playerName;

                if (role === 'member') {
                    message += `🎉 **${name}**, who will get promoted to **Elder**! 🎉\n`;

                } else if (role === 'elder') {
                    message += `🎉 **${name}**, who will get promoted to **Co-Leader**! 🎉\n`;

                } else if (role === 'coleader') {

                    // if the leader of the clan is also one of the highest players
                    if (leaderIsHighest) {

                        message += `🎉 **${name}**, who is currently **Co-Leader**! Unfortunately for them, the Leader of the clan tied with them, so they wont be getting promoted. However, they have a chance to become Leader if they win again next week! 🎉\n`;

                        // mark in the datebase that they won the role shuffle this week
                        const roleShuffleProfile = new RoleShuffle({
                            _id: new mongoose.Types.ObjectId(),
                            playerTag: participant.playerTag,
                            highestFame: true,
                            lowestFame: false,
                            date: now,
                        });
                        roleShuffleProfile.save().catch(console.error);

                    } else {

                        // TODO: check if they won the role shuffle last week
                        const roleShuffleProfile = await RoleShuffle.findOne({ playerTag: participant.playerTag }, null, { sort: { date: -1 } });
                        if (!roleShuffleProfile) {
                            console.error(`${getCurrentTimeString()}   ` + chalk.yellow(`[Warning] Event weekly-role-shuffle: Role shuffle profile not found for player #${participant.playerTag} in clan #${clanProfile.clanTag}!`));
                            return;
                        }

                        if (!isDateOlderThanXDays(roleShuffleProfile.date, 8)) {
                            console.error(`${getCurrentTimeString()}   ` + chalk.yellow(`[Warning] Event weekly-role-shuffle: Role shuffle profile for player ${participant.playerTag} in clan ${clanProfile.clanTag} is too old! Assuming they did not win last week.`));
                            roleShuffleProfile.highestFame = false;
                        }

                        // if they won last week
                        if (roleShuffleProfile.highestFame) {
                            message += `🎉 **${name}**, who is currently **Co-Leader**! Since this is the second consecutive win for them, they will be promoted to **Leader**. All Hail ${name}! 🎉\n`;

                        } else {
                            message += `🎉 **${name}**, who is currently **Co-Leader**! In order to become Leader, the rules state that you have to win 2 consecutive weeks. If ${name} can squeak out a win again next week, they'll become the new Leader! 🎉\n`;

                            // mark in the datebase that they won the role shuffle this week
                            const roleShuffleProfile = new RoleShuffle({
                                _id: new mongoose.Types.ObjectId(),
                                playerTag: participant.playerTag,
                                highestFame: true,
                                lowestFame: false,
                                date: now,
                            });
                            roleShuffleProfile.save().catch(console.error);
                        }
                    }

                } else if (role === 'leader') {

                    // TODO: change this messsage to a ChatGPT response
                    message += `🎉 **${name}**, who is already the **Leader**! Everyone wants to be like ${name} because they are so cool and the best gamer to ever live. 🎉\n`;

                }
            });


            message += `\nNow for the **most cooked and omega sus** player(s) who got ${highestFamePlayers[0].fame} medals in the clan war this week:\n`;

            lowestFamePlayers.forEach( async (participant) => {
                const role = participant.role.toLowerCase();
                const name = participant.playerName;

                if (role === 'member') {
                    // TODO: Change this to a ChatGPT response
                    message += `💀 **${name}**, who will be demoted to **Member**! Oh, wait. They're already a member... Laugh at this user! They're Joever. 💀\n`;

                } else if (role === 'elder') {
                    message += `💀 **${name}**, who will be demoted to **Member**! 💀\n`;

                } else if (role === 'coleader') {
                    message += `💀 **${name}**, who will be demoted to **Elder**! 💀\n`;

                } else if (role === 'leader') {
                    // TODO: Change this to a ChatGPT response
                    message += `💀 **${name}**, who is currently the **Leader**! 💀💀💀 Honestly, how did they fall off so hard? It's kinda cringe tbh and they should be ashamed. Someone has to replace them ASAP but I wouldn't be suprised if they demoted themselves out of shame. 💀\n`;

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
            });

            channel.send(message);
        });

    }
}