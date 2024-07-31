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
    
    if (riverRaceLog.status === 200) {
        return riverRaceLog.data;
    }
    return undefined;
};

const getCurrentRiverRace = async (clanTag) => {
    const riverRace = await getRequest(`/clans/%23${clanTag}/currentriverrace`);
    
    if (riverRace.status === 200) {
        return riverRace.data;
    }
    return undefined;
};

const getPlayer = async (playerTag) => {
    const player = await getRequest(`/players/%23${playerTag}`);

    if (player.status === 200) {
        return player.data;
    }
    return undefined;
};

const getClan = async (clanTag) => {
    const clan = await getRequest(`/clans/%23${clanTag}`);
    
    if (clan.status === 200) {
        return clan.data;
    }
    return undefined;
};


module.exports = {
    getRiverRaceLog,
    getCurrentRiverRace,
    getPlayer,
    getClan,
};