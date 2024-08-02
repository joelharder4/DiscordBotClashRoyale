const { SlashCommandBuilder } = require('discord.js');
const Player = require('../../schemas/playerTag');
const PrimaryChannels = require('../../schemas/primaryChannels');

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

        // if they are not currently a participant
        if (!userPlayerProfile.roleShuffleParticipant) {

            userPlayerProfile.roleShuffleParticipant = true;
            await userPlayerProfile.save().catch(console.error);

            await interaction.reply({
                content: `<@${user.id}> are now participating in the role shuffle! Yippee!`,
            });

        } else {

            userPlayerProfile.roleShuffleParticipant = false;
            await userPlayerProfile.save().catch(console.error);

            await interaction.reply({
                content: `Congratulations <@${user.id}>, you coward! You aren't a part of the based role shuffle anymore.`,
            });

        }
    },
};