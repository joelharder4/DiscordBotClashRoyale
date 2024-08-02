const { Schema, model } = require('mongoose');

const roleShuffleSchema = new Schema({
    _id: Schema.Types.ObjectId,
    playerTag: {type: String, required: true},
    highestFame: {type: Boolean, default: false},
    lowestFame: {type: Boolean, default: false},
    date: {type: Date, required: true},
});

module.exports = model("RoleShuffle", roleShuffleSchema, "roleShuffle");