const { Schema, model } = require('mongoose');

const playerTagSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String,
    playerTag: String,
    userName: String,
    playerName: String,
    roleShuffleParticipant: { type: Boolean, default: false },
});

module.exports = model("PlayerTag", playerTagSchema, "playertag");