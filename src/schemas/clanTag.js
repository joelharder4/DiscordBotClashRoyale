const { Schema, model } = require('mongoose');

const clanTagSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    clanTag: String,
    guildName: { type: String, required: false },
    clanName: { type: String, required: false },
});

module.exports = model("ClanTag", clanTagSchema, "clantags");