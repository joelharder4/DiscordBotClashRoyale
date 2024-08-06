const chalk = require('chalk');
const ClanWarDay = require('../../schemas/clanWarDay');
const PlayerWarDay = require('../../schemas/playerWarDay');
const Clan = require('../../schemas/clanTag');
const { getCurrentRiverRace, getClan } = require('../../services/clashRoyaleAPI');
const { getCurrentTimeString, isDateNewerThanXHours } = require('../../utils/time');
const mongoose = require('mongoose');

module.exports = {
    name: 'collect-war-data-daily',
    // detailed schedule info: https://www.npmjs.com/package/node-schedule
    // 'second (optional) minute hour dayofmonth month dayofweek'
    // IMPORTANT: new battle day starts at 5:34am EST so this job should run right before that
    schedule: '0 30 5 * * *', // = 5:30:00am every day
    async execute(client) {
 
        const clanGuildProfiles = await Clan.find({});
        const processedClans = [];
        // TODO: add clanName and periodType to the collect data job

        console.log(`${getCurrentTimeString()}   ` + chalk.green(`[Running] Job ${this.name}: Started collecting war data`));

        for (const clanGuild of clanGuildProfiles) {

            const clanTag = clanGuild.clanTag;
            if (processedClans.includes(clanTag)) {
                return;
            }

            const [war, clan] = await Promise.all([
                getCurrentRiverRace(clanTag),
                getClan(clanTag)
            ]).catch(console.error);

            if (!war) {
                console.error(`${getCurrentTimeString()}   ` + chalk.red(`[Error] Job collect-war-data-daily: Nothing retrieved from API for clan ${clanTag}`));
                return;
            }

            processedClans.push(clanTag);
            const now = new Date();

            const playerList = [];
            for (const member of war.clan.participants) {

                // some information about the player comes from a different API call
                const clanMember = clan.memberList.find( (clanMember) => clanMember.tag === member.tag );
                if (!clanMember) {
                    console.error(`${getCurrentTimeString()}   ` + chalk.red(`[Error] Job collect-war-data-daily: Found clan member tag \`#${member.tag}\` in the river race data but not in the api data for clan \`#${clanTag}\``));
                    continue;
                }

                const playerWarDay = new PlayerWarDay({
                    _id: new mongoose.Types.ObjectId(),
                    playerTag: member.tag.substring(1),
                    name: member.name,
                    fame: member.fame,
                    decksUsed: member.decksUsed,
                    decksUsedToday: member.decksUsedToday,
                    role: clanMember.role.toLowerCase(),
                    date: now,
                });

                playerList.push(playerWarDay);
                playerWarDay.save().catch(console.error);
            }
            
            const previousWar = await ClanWarDay.findOne({ clanTag: clanTag }, null, { sort: { date: -1 } });
            let fameToday = war.clan.fame; // default in case it is the first battle day
            if (previousWar && war.clan.fame > 0) {
                if (isDateNewerThanXHours(previousWar.date, 25)) {
                    fameToday = war.clan.fame - previousWar.totalFame;
                }
            }

            const clanWarDay = new ClanWarDay({
                _id: new mongoose.Types.ObjectId(),
                clanTag: clanTag,
                clanName: war.clan.name,
                totalFame: war.clan.fame,
                fameToday: fameToday,
                periodType: war.periodType.toLowerCase(),
                participants: playerList,
                date: now,
            });

            await clanWarDay.save().catch(console.error);
        }
    }
}