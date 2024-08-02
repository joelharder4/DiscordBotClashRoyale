const chalk = require('chalk');
const ClanWarWeek = require('../../schemas/clanWarWeek');
const PlayerWarWeek = require('../../schemas/playerWarWeek');
const Clan = require('../../schemas/clanTag');
const { getCurrentRiverRace, getClan } = require('../../services/clashRoyaleAPI');
const { getCurrentTimeString } = require('../../utils/time');
const mongoose = require('mongoose');

module.exports = {
    name: 'collect-war-data-weekly',
    // detailed schedule info: https://www.npmjs.com/package/node-schedule
    // 'second (optional) minute hour dayofmonth month dayofweek'
    // IMPORTANT: new battle day starts at 5:34am EST? new war week start on Monday
    schedule: '0 * * * * *', // '0 29 5 * * 1', // = 5:29:00am on Mondays
    async execute(client) {

        const clanGuildProfiles = await Clan.find({});

        clanGuildProfiles.forEach( async (clanGuild) => {

            const clanTag = clanGuild.clanTag;
            const war = await getCurrentRiverRace(clanTag);
            const clan = await getClan(clanTag);

            if (!war || !clan) {
                console.error(`${getCurrentTimeString()}   ` + chalk.red(`[Error] Job collect-war-data-weekly: Nothing retrieved from API for clan ${clanTag}`));
                return;
            }

            const now = new Date();

            const playerList = [];
            war.clan.participants.reverse().forEach( async (member) => {

                // some information about the player comes from a different API call
                const clanMember = clan.memberList.find( (clanMember) => clanMember.tag === member.tag );
                if (!clanMember) {
                    console.error(`${getCurrentTimeString()}   ` + chalk.red(`[Error] Job collect-war-data-weekly: Found clan member tag \`#${member.tag}\` in the river race data but not in the clan data for clan \`#${clanTag}\``));
                    return;
                }

                const warWeekPlayer = new PlayerWarWeek({
                    _id: new mongoose.Types.ObjectId(),
                    playerTag: member.tag.substring(1),
                    name: member.name,
                    fame: member.fame,
                    decksUsed: member.decksUsed,
                    role: clanMember.role.toLowerCase(),
                    date: now,
                });

                playerList.push(warWeekPlayer);
                warWeekPlayer.save().catch(console.error);
            });
            

            const clanWarWeek = new ClanWarWeek({
                _id: new mongoose.Types.ObjectId(),
                clanTag: clanTag,
                fame: war.clan.fame,
                participants: playerList,
                date: now,
            });

            await clanWarWeek.save().catch(console.error);

        });

        console.log(`${getCurrentTimeString()}   ` + chalk.green(`[Complete] Job collect-war-data-weekly: Finished collecting war data`));
    }
}