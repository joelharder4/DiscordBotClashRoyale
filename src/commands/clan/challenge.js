const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Player = require('../../schemas/playerTag');
const Challenge = require('../../schemas/challenge');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('challenge')
        .setDescription('Challenge another player in the clan war!')
        .addUserOption((option) =>
            option.setName('user')
                .setDescription('The user you want to challenge')
                .setRequired(true)),
    
    async execute(interaction, client) {
        const targetUser = interaction.options.getUser('user');

        const userProfile = await Player.findOne({ userId: interaction.user.id });

        if (!userProfile) {
            await interaction.reply({
                content: `You need to set your player tag before you can challenge other users!\nUse \`/playertag\` to set your player tag.`,
                ephemeral: true,
            });
            return;
        }

        // TODO: Check if the challenger has already challenged that person in the last 60 seconds

        // TODO: Check if the users already have an active challenge between them

        if (targetUser.id === interaction.user.id) {
            await interaction.reply({
                content: `You can't challenge yourself!`,
                ephemeral: true,
            });
            return;
        }

        const accept = new ButtonBuilder()
            .setCustomId('accept-challenge')
            .setLabel(`Accept`)
            .setStyle(ButtonStyle.Success);

        const deny = new ButtonBuilder()
            .setCustomId('deny-challenge')
            .setLabel(`Deny`)
            .setStyle(ButtonStyle.Danger);

        let challenge = new Challenge({
            _id: new mongoose.Types.ObjectId(),
            userId1: interaction.user.id,
            userId2: targetUser.id,
            userName1: interaction.user.globalName,
            userName2: targetUser.globalName,
            startTime: Date.now(),
            status: "pending",
        });

        await challenge.save().catch(console.error);

        await interaction.reply({
            content: `<@${targetUser.id}>, you have been challenged by <@${interaction.user.id}>!`,
            components: [new ActionRowBuilder().addComponents(accept, deny)]
        });
    }
}