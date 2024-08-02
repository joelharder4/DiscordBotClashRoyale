const { Schema, model } = require('mongoose');
const { playerWarWeekSchema } = require('./playerWarWeek');

const clanWarWeekSchema = new Schema({
    _id: Schema.Types.ObjectId,
    clanTag: {type: String, required: true},
    fame: {type: Number, required: true},
    participants: {
        type: [playerWarWeekSchema],
        required: true
    },
    date: {type: Date, required: true},
});

module.exports = model("ClanWarWeek", clanWarWeekSchema, "clanwarweek");