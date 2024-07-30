const { Schema, model } = require('mongoose');

const enabledJobsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    jobNames: [String],
});

module.exports = model("EnabledJobs", enabledJobsSchema, "enabledJobs");