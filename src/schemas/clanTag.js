const { Schema, model } = require('mongoose');

const clanTagSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: {type: String, required: true},
    clanTag: {type: String, required: true},
    guildName: String,
    clanName: String,
});

module.exports = model("ClanTag", clanTagSchema, "clantags");