const { Schema, model } = require('mongoose');

const primaryChannelsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    channelId: String,
});

module.exports = model("PrimaryChannels", primaryChannelsSchema, "primaryChannels");