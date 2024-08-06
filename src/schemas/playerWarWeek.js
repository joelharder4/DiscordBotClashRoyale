const { Schema, model } = require('mongoose');

const playerWarWeekSchema = new Schema({
    _id: Schema.Types.ObjectId,
    playerTag: {type: String, required: true},
    name: {type: String, required: true},
    fame: {type: Number, required: true},
    decksUsed: {type: Number, required: true},
    role: { 
        type: String,
        enum: ["elder", "member", "coleader", "leader"],
        // according to supercell docs it can also be "not_member" and "admin"?
        required: true,
    },
    date: {type: Date, required: true},
});

module.exports = model("PlayerWarWeek", playerWarWeekSchema, "playerwarweek");