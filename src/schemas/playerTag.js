const { Schema, model } = require('mongoose');

const playerTagSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String,
    playerTag: String,
    userName: String,
    playerName: String,
});

module.exports = model("PlayerTag", playerTagSchema, "playertag");