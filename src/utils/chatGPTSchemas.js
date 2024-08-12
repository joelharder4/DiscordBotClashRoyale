
// TODO: Elixir costs might be more accurate if the ai can talk it's way through the elixir cost of the card
const deckGeneratorSchema = {
    name: "clash_royale_deck",
    description: "The themed generated deck for Clash Royale",
    strict: true,
    schema: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "The silly and goofy name of the deck",
            },
            description: {
                type: "string",
                description: "The description of why you chose these 8 cards for this deck",
            },
            strategy: {
                type: "string",
                description: "The strategy outlining which cards the player should make pushes/defences with in order to win the game",
            },
            cards: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "The name of the card",
                        },
                        rarity: {
                            type: "string",
                            enum: ["common", "rare", "epic", "legendary", "champion"],
                        },
                        cost: {
                            type: "number",
                            description: "The elixir cost of the card from 1 to 9, or 0 for mirror",
                        }
                    },
                    required: ["name", "rarity", "cost"],
                    additionalProperties: false,
                }
            },
        },
        required: ["name", "description", "strategy", "cards"],
        additionalProperties: false,
    }
}


module.exports = {
    deckGeneratorSchema,
}