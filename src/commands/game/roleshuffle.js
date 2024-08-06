const { SlashCommandBuilder } = require('discord.js');
const Player = require('../../schemas/playerTag');
const PrimaryChannels = require('../../schemas/primaryChannels');
const ShuffleParticipant = require('../../schemas/shuffleParticipant');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleshuffle')
        .setDescription('Toggles your participation in the weekly role shuffle game based on clan war performance!'),
    async execute(interaction, client) {

        const guildId = interaction.guild.id;
        // make sure the guild has a primary channel set
        const primaryChannelProfile = await PrimaryChannels.findOne({ guildId: guildId });
        if (!primaryChannelProfile) {
            await interaction.reply({
                content: `You need to assign me a channel for this server before you can use this feature!\nUse \`/setchannel\` to set the channel.`,
                ephemeral: true,
            });
            return;
        }

        const userId = interaction.user.id;
        const userPlayerProfile = await Player.findOne({ userId: userId });
        if (!userPlayerProfile) {
            await interaction.reply({
                content: `You need to set your player tag before you can participate in the role shuffle!\nUse \`/setplayertag\` to set your player tag.`,
                ephemeral: true,
            });
            return;
        }

        const shuffleParticipantProfile = await ShuffleParticipant.findOne({ userId: userId, guildId: guildId });

        if (!shuffleParticipantProfile) {

            const newShuffleParticipant = new ShuffleParticipant({
                _id: new mongoose.Types.ObjectId(),
                userId: userId,
                guildId: guildId,
                optedIn: true,
            });
            newShuffleParticipant.save().catch(console.error);

            await interaction.reply({
                content: `<@${userId}> is now participating in the role shuffle! Yippee!`,
            });

        } else {

            if (shuffleParticipantProfile.optedIn) {
                await interaction.reply({
                    content: `<@${userId}> is a coward who is scared of role shuffling! They are no longer participating in it.`,
                });
            } else {
                await interaction.reply({
                    content: `<@${userId}> is now participating in the role shuffle! Yippee!`,
                });
            }

            shuffleParticipantProfile.optedIn = !shuffleParticipantProfile.optedIn;
            await shuffleParticipantProfile.save().catch(console.error);

        }
    },
};