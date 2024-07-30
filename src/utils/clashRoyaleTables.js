const { table } = require('table');


const currentRiverRaceTable = async (currentWar) => {

    const participants = currentWar.clan.participants.reverse();

    const dataTable = [
        ['Player', 'Medals', 'Decks', 'Medals/Deck', 'Boat Attacks'],
    ];

    for (const player of participants) {
        const name = player.name;
        const fame = player.fame.toString();
        const decksUsedToday = (4 - player.decksUsedToday).toString();
        const famePerDeck = player.decksUsed ? "N/A" : Math.round(player.fame / player.decksUsed).toString();
        const boatAttacks = player.boatAttacks.toString();

        dataTable.push([name, fame, decksUsedToday, famePerDeck, boatAttacks]);
    }

    const config = {
        drawHorizontalLine: (lineIndex, rowCount) => {
            return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount;
        },
    };

    return table(dataTable, config);
}

module.exports = {
    currentRiverRaceTable,
}