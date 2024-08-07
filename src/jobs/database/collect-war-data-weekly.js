const ClanWarWeek = require('../../schemas/clanWarWeek');
const PlayerWarWeek = require('../../schemas/playerWarWeek');
const Clan = require('../../schemas/clanTag');
const { getCurrentRiverRace, getClan } = require('../../services/clashRoyaleAPI');
const logger = require('../../utils/logger');
const mongoose = require('mongoose');

module.exports = {
    name: 'collect-war-data-weekly',
    // detailed schedule info: https://www.npmjs.com/package/node-schedule
    // 'second (optional) minute hour dayofmonth month dayofweek'
    // IMPORTANT: new battle day starts at 5:34am EST? new war week start on Monday
    schedule: '0 29 5 * * 1', // = 5:29:00am on Mondays
    async execute(client) {

        const clanGuildProfiles = await Clan.find({});

        clanGuildProfiles.forEach( async (clanGuild) => {

            const clanTag = clanGuild.clanTag;
            const [war, clan] = await Promise.all([
                getCurrentRiverRace(clanTag),
                getClan(clanTag)
            ]).catch(console.error);

            if (!war || !clan) {
                logger.error(`Job ${this.name}: Nothing retrieved from API for clan ${clanTag}`);
                return;
            }

            const now = new Date();

            const playerList = [];
            for (const member of war.clan.participants) {

                // some information about the player comes from a different API call
                const clanMember = clan.memberList.find( (clanMember) => clanMember.tag === member.tag );
                if (!clanMember) {
                    logger.error(`Job ${this.name}: Found clan member tag \`#${member.tag}\` in the river race data but not in the clan data for clan \`#${clanTag}\``);
                    continue;
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
            }
            

            const clanWarWeek = new ClanWarWeek({
                _id: new mongoose.Types.ObjectId(),
                clanTag: clanTag,
                fame: war.clan.fame,
                participants: playerList,
                date: now,
            });

            await clanWarWeek.save().catch(console.error);

        });

        logger.running(`Job ${this.name}: job began collecting war data for all guilds`);
    }
}