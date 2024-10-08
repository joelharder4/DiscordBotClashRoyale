const { Schema, model } = require('mongoose');

const challengeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId1: Number,
    userId2: Number,
    userName1: String,
    userName2: String,
    startTime: Date,
    status: { 
        type: String,
        enum: ["pending", "declined", "ongoing", "completed"],
        required: true,
    },
    winner: {
        type: String,
        enum: ["1", "2", "tie"],
        required: false,
    },
});

module.exports = model("Challenge", challengeSchema, "challenge");