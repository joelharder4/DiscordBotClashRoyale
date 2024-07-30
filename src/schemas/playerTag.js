const { Schema, model } = require('mongoose');

const playerTagSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String,
    playerTag: String,
    userName: { type: String, required: false },
    playerName: { type: String, required: false },
});

module.exports = model("PlayerTag", playerTagSchema, "playertags");