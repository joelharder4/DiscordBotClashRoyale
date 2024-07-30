const { SlashCommandBuilder } = require('discord.js');
const PrimaryChannels = require('../../schemas/primaryChannels');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Sets the channel that this bot will send automatic messages in.')
        .addChannelOption((option) =>
            option.setName('channel')
                .setDescription('The channel this bot will use.')
                .setRequired(true)),
    async execute(interaction, client) {
        const channel = interaction.options.getChannel('channel');
        const guildId = interaction.guild.id;

        const primaryChannelProfile = await PrimaryChannels.findOne({ guildId: guildId });

        // if it doesnt exist in the database
        if (!primaryChannelProfile) {

            // create a new entry in the database
            let primaryChannel = new PrimaryChannels({
                _id: new mongoose.Types.ObjectId(),
                guildId: guildId,
                channelId: channel.id,
            });

            await primaryChannel.save().catch(console.error);

        } else { // it does exist in the database
            
            //update the channelId
            primaryChannelProfile.channelId = channel.id;

            await primaryChannelProfile.save().catch(console.error);

        }

        await interaction.reply({
            content: `I will now send my automatic messages to <#${channel.id}>!`,
        });
    },
};