const chalk = require('chalk');
const ClanWarDay = require('../../schemas/clanWarDay');
const PlayerWarDay = require('../../schemas/playerWarDay');
const Clan = require('../../schemas/clanTag');
const { getCurrentRiverRace } = require('../../services/clashRoyaleAPI');
const { getCurrentTimeString, isDateNewerThanXHours } = require('../../utils/time');
const mongoose = require('mongoose');

module.exports = {
    name: 'collect-war-data-daily',
    // detailed schedule info: https://www.npmjs.com/package/node-schedule
    // 'second (optional) minute hour dayofmonth month dayofweek'
    // IMPORTANT: new battle day starts at 5:34am EST? So this job should run at 5:30am EST to be safe
    schedule: '0 30 5 * * *',
    async execute(client) {

        const clanGuildProfiles = await Clan.find({});

        clanGuildProfiles.forEach( async (clanGuild) => {

            const clanTag = clanGuild.clanTag;
            const war = await getCurrentRiverRace(clanTag);

            if (!war) {
                console.error(`${getCurrentTimeString()}   ` + chalk.red(`[Error] Job collect-war-data-daily: Nothing retrieved from API for clan ${clanTag}`));
                return;
            }

            const now = new Date();

            const playerList = [];
            war.clan.participants.reverse().forEach( async (member) => {
                const playerWarDay = new PlayerWarDay({
                    _id: new mongoose.Types.ObjectId(),
                    playerTag: member.tag.substring(1),
                    name: member.name,
                    fame: member.fame,
                    decksUsed: member.decksUsedToday,
                    date: now,
                });

                playerList.push(playerWarDay);
                playerWarDay.save().catch(console.error);
            });
            
            const previousWar = await ClanWarDay.findOne({ clanTag: clanTag }, null, { sort: { date: -1 } });
            let fameToday = war.clan.fame; // default in case it is the first battle day
            if (previousWar) {
                if (isDateNewerThanXHours(previousWar.date, 25)) {
                    fameToday = war.clan.fame - previousWar.totalFame;
                }
            }

            const clanWarDay = new ClanWarDay({
                _id: new mongoose.Types.ObjectId(),
                clanTag: clanTag,
                totalFame: war.clan.fame,
                fameToday: fameToday,
                participants: playerList,
                date: now,
            });

            await clanWarDay.save().catch(console.error);

        });

        console.log(`${getCurrentTimeString()}   ` + chalk.green(`[Complete] Job collect-war-data-daily: Finished collecting war data`));
    }
}