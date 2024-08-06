const { table, getBorderCharacters } = require('table');


const clanMembersTable = async (clan, maxRows = 25) => {

    const memberList = clan.memberList;

    const dataTable = [
        ['Member', 'Trophies', 'Role', 'Last Online'],
    ];

    for (const member of memberList) {
        if (memberList.indexOf(member) >= maxRows) {
            dataTable.push(['...', '...', '...', '...']);
            break;
        }

        const name = member.name;
        const trophies = member.trophies.toString();
        const role = member.role;

        const date = new Date(
            member.lastSeen.replace(
                /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}\.\d{3}Z)$/,
                '$1-$2-$3T$4:$5:$6'
            )
        );
        const lastOnline = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        dataTable.push([name, trophies, role, lastOnline]);
    }

    const config = {
        drawHorizontalLine: (lineIndex, rowCount) => {
            return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount;
        },
    };

    return table(dataTable, config);

}



const currentRiverRaceTable = async (currentWar, maxRows = 20) => {

    const participants = currentWar.clan.participants.reverse();

    const dataTable = [
        ['Player', 'Medals', 'Decks', 'Medals/Deck', 'Boat Atks'],
    ];

    for (const player of participants) {
        if (participants.indexOf(player) >= maxRows) {
            dataTable.push(['...', '...', '...', '...', '...']);
            break;
        }

        const name = player.name;
        const fame = player.fame.toString();
        const decksUsedToday = (4 - player.decksUsedToday).toString();
        const famePerDeck = player.decksUsed ? Math.round(player.fame / player.decksUsed).toString() : "N/A";
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


const clanWarDayTable = async (war, maxRows = 20) => {

    const participants = war.participants;

    const dataTable = [
        ['Player', 'Medals', 'Decks', 'Medals/Deck', 'Role'],
    ];

    for (const player of participants) {
        if (participants.indexOf(player) >= maxRows) {
            dataTable.push(['...', '...', '...', '...', '...']);
            break;
        }

        const name = player.name;
        const fame = player.fame.toString();
        const decksUsedToday = (4 - player.decksUsedToday).toString();
        const famePerDeck = player.decksUsed > 0 ? Math.round(player.fame / player.decksUsed).toString() : "N/A";

        dataTable.push([name, fame, decksUsedToday, famePerDeck, player.role]);
    }

    const config = {
        drawHorizontalLine: (lineIndex, rowCount) => {
            return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount;
        },
    };

    return table(dataTable, config);
}



const cardLevelTable = async (playerCards) => {

    const cardLevelCounts = {};
    for (const card of playerCards) {
        // for some reason level 15 is not included in maxLevel
        const level = 14 - (card.maxLevel - card.level);
        if (level in cardLevelCounts) {
            cardLevelCounts[level] += 1;
        } else {
            cardLevelCounts[level] = 1;
        }
    }

    const dataTable = [
        ['Level', 'Count'],
    ];

    for (let i = 1; i  <= 15; i++) {
        if (i in cardLevelCounts) {
            dataTable.push([i.toString(), cardLevelCounts[i].toString()]);
        } else {
            dataTable.push([i.toString(), '0']);
        }
    }

    const config = {
        drawHorizontalLine: (lineIndex, rowCount) => {
            return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount;
        },
    };

    return table(dataTable, config);
}




// deck should be an array of 8 card objects
// each card object has a name, rarity, and cost property
const deckTable = async (deck) => {
    
    const dataTable = [];
    let row = [];

    for (let i = 0; i < 8; i++) {
        const card = deck[i];
        const name = card.name ?? "Joe Biden";
        const rarity = card.rarity ?? "Joever";
        let elixir = card.cost.toString() ?? "11";
        elixir += " Elixir";

        let info = `${name}\n(${rarity})\n${elixir}`;
        if (i < 4) info += '\n';

        row.push(info);

        if (i === 3) {
            dataTable.push(row);
            row = [];
        }
    }

    dataTable.push(row);

    // max width of a discord code block is 65 characters
    const config = {
        border: getBorderCharacters(`void`),
        columnDefault: {
            paddingLeft: 0,
            paddingRight: 1,
        },
        columns: [
            { alignment: 'center', width: 15 },
            { alignment: 'center', width: 15 },
            { alignment: 'center', width: 16 },
            { alignment: 'center', width: 16 },
        ],
        
        drawHorizontalLine: () => false,
    };

    return table(dataTable, config);
}



module.exports = {
    currentRiverRaceTable,
    clanMembersTable,
    clanWarDayTable,
    cardLevelTable,
    deckTable,
}