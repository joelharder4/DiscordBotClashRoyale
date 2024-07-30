const { SlashCommandBuilder } = require('discord.js');
const EnabledJobs = require('../../schemas/enabledJobs');
const PrimaryChannels = require('../../schemas/primaryChannels');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailywarupdate')
        .setDescription('Toggles daily war summary messages!'),
    async execute(interaction, client) {
        const jobName = 'daily-war-summary';
        const guildId = interaction.guild.id;

        // make sure the guild has a primary channel set
        const primaryChannelProfile = await PrimaryChannels.findOne({ guildId: guildId });
        if (!primaryChannelProfile) {
            await interaction.reply({
                content: `You need to assign me a channel before you can use automated messages!\nUse \`/setchannel\` to set the channel.`,
                ephemeral: true,
            });
            return;
        }

        const enabledJobsProfile = await EnabledJobs.findOne({ guildId: guildId });

        // if the guild is already in the database
        if (enabledJobsProfile) {

            const enabledJobs = enabledJobsProfile.jobNames;

            // if the job is already enabled
            if (enabledJobs.includes(jobName)) {

                // remove the job from the enabledJobs array
                const newEnabledJobs = enabledJobs.filter(job => job !== jobName);
                enabledJobsProfile.jobNames = newEnabledJobs;

                await interaction.reply({
                    content: `Daily war summaries are now **disabled**!`,
                });

            } else {

                // add the job to the enabledJobs array
                enabledJobs.push(jobName);
                enabledJobsProfile.jobNames = enabledJobs;

                await interaction.reply({
                    content: `Daily war summaries are now **enabled**!`,
                });

            }

            await enabledJobsProfile.save().catch(console.error);

        } else {

            // add guild to the database
            let enabledJobs = new EnabledJobs({
                _id: new mongoose.Types.ObjectId(),
                guildId: guildId,
                jobNames: [jobName],
            });

            await enabledJobs.save().catch(console.error);

            await interaction.reply({
                content: `Daily war summaries are now **enabled**!`,
            });

        }


        
        
        // if the guild is already in the database
            
            // if the job is already enabled
                // remove the job from the enabledJobs array
           
            // else
                // add the job to the enabledJobs array
        
        // else if the guild is not in the database
            // add guild to the database
            // add job to the enabledJobs array
    },
};