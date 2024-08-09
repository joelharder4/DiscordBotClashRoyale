const { Schema, model } = require('mongoose');
const { playerWarDaySchema } = require('./playerWarDay');

const clanWarDaySchema = new Schema({
    _id: Schema.Types.ObjectId,
    clanTag: {type: String, required: true},
    clanName: {type: String, required: true},
    totalFame: {type: Number, required: true},
    fameToday: {type: Number, required: true},
    periodType: {
        type: String,
        enum: ["training", "warday", "colosseum"],
        required: true
    },
    participants: {
        type: [playerWarDaySchema],
        required: true
    },
    date: {type: Date, required: true},
});

module.exports = model("ClanWarDay", clanWarDaySchema, "clanwarday");