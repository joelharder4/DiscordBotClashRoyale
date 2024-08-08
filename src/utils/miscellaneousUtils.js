
// These values represent the number of cards needed to upgrade a card to a certain level.
// For example, to upgrade a common card TO level 3, you need 4 cards.
// Source: https://clash.world/guides/card-upgrade-costs/
const cardsNeededForUpgrade = {
    common: {
        1: 1,
        2: 2,
        3: 4,
        4: 10,
        5: 20,
        6: 50,
        7: 100,
        8: 200,
        9: 400,
        10: 800,
        11: 1000,
        12: 1500,
        13: 3000,
        14: 5000,
        15: 0,
    },
    rare: {
        1: 0,
        2: 0,
        3: 1,
        4: 2,
        5: 4,
        6: 10,
        7: 20,
        8: 50,
        9: 100,
        10: 200,
        11: 400,
        12: 500,
        13: 750,
        14: 1250,
        15: 0,
    },
    epic: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 1,
        7: 2,
        8: 4,
        9: 10,
        10: 20,
        11: 40,
        12: 50,
        13: 100,
        14: 200,
        15: 0,
    },
    legendary: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 1,
        10: 2,
        11: 4,
        12: 6,
        13: 10,
        14: 20,
        15: 0,
    },
    champion: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 1,
        12: 2,
        13: 8,
        14: 20,
        15: 0,
    },
}

const calculateCumulativeSums = (obj) => {
    const result = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = Object.keys(obj[key]).reduce((cumulative, currentKey) => {
                const num = parseInt(currentKey, 10);
                cumulative[num] = (cumulative[num - 1] || 0) + obj[key][num];
                return cumulative;
            }, {});
        }
    }

    return result;
};
const totalCardsAtLevel = calculateCumulativeSums(cardsNeededForUpgrade);



const totalsCommonCardsAtXLevel = (level) => {
    return totalCardsAtLevel.common[level] ?? 0;
};
const totalsRareCardsAtXLevel = (level) => {
    return totalCardsAtLevel.rare[level] ?? 0;
};
const totalsEpicCardsAtXLevel = (level) => {
    return totalCardsAtLevel.epic[level] ?? 0;
};
const totalsLegendaryCardsAtXLevel = (level) => {
    return totalCardsAtLevel.legendary[level] ?? 0;
};
const totalsChampionCardsAtXLevel = (level) => {
    return totalCardsAtLevel.champion[level] ?? 0;
};

const totalCardsAtXLevel = (level, rarity) => {
    switch (rarity.toLowerCase()) {
        case 'common':
            return totalsCommonCardsAtXLevel(level);
        case 'rare':
            return totalsRareCardsAtXLevel(level);
        case 'epic':
            return totalsEpicCardsAtXLevel(level);
        case 'legendary':
            return totalsLegendaryCardsAtXLevel(level);
        case 'champion':
            return totalsChampionCardsAtXLevel(level);
        default:
            return 0;
    }
}

const cardStartingLevels = {
    common: 1,
    rare: 3,
    epic: 6,
    legendary: 9,
    champion: 11,
};

const correctCardLevel = (level, rarity) => {
    return cardStartingLevels[rarity.toLowerCase()] + level - 1;
}

const playerTotalCardCount = (playerCards) => {
    const cardCounts = {
        common: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
        champion: 0,
    };

    for (const card of playerCards) {
        const rarity = card.rarity.toLowerCase();
        // correct because card.level starts at 1 no matter the rarity
        const level = correctCardLevel(card.level, rarity);

        cardCounts[rarity] += totalCardsAtXLevel(level, rarity) + card.count;
    }

    return cardCounts;
}




module.exports = {
    totalCardsAtXLevel,
    correctCardLevel,
    playerTotalCardCount,
};