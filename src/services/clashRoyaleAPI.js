const axios = require('axios');
const { clashRoyaleToken } = process.env;

const getRequest = async (endpoint) => {
    const response = await axios.get("https://api.clashroyale.com/v1" + endpoint, {
        headers: 
            {
                Authorization: `Bearer ${clashRoyaleToken}`
            }
    });

    return response;
};

const getRiverRaceLog = async (clanTag) => {
    const riverRaceLog = await getRequest(`/clans/%23${clanTag}/riverracelog`);
    return riverRaceLog.data;
};

const getCurrentRiverRace = async (clanTag) => {
    const riverRace = await getRequest(`/clans/%23${clanTag}/currentriverrace`);
    return riverRace.data;
};

const getPlayer = async (playerTag) => {
    const player = await getRequest(`/players/%23${playerTag}`);
    return player.data;
};

const getClan = async (clanTag) => {
    const clan = await getRequest(`/clans/%23${clanTag}`);
    return clan.data;
};


module.exports = {
    getRiverRaceLog,
    getCurrentRiverRace,
    getPlayer,
    getClan,
};