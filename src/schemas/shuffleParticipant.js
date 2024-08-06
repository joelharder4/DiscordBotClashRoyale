const { Schema, model } = require('mongoose');

const shuffleParticipantSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: {type: String, required: true},
    guildId: {type: String, required: true},
    optedIn: {type: Boolean, default: false},
});

module.exports = model("ShuffleParticipant", shuffleParticipantSchema, "shuffleparticipant");