const { Schema, model } = require('mongoose');

const playerWarDaySchema = new Schema({
    _id: Schema.Types.ObjectId,
    playerTag: {type: String, required: true},
    name: {type: String, required: true},
    fame: {type: Number, required: true},
    decksUsed: {type: Number, required: true},
    decksUsedToday: {type: Number, required: true},
    role: { 
        type: String,
        enum: ["elder", "member", "leader", "coleader"],
        // according to supercell docs it can also be "not_member" and "admin"?
        required: true,
    },
    date: {type: Date, required: true},
});

module.exports = model("PlayerWarDay", playerWarDaySchema, "playerwarday");