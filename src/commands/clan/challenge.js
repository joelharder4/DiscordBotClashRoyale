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

        // if the user has not set their player tag
        if (!userProfile) {
            await interaction.reply({
                content: `You need to set your player tag before you can challenge other users!\nUse \`/playertag\` to set your player tag.`,
                ephemeral: true,
            });
            return;
        }

        // if the user is challenging themselves
        if (targetUser.id === interaction.user.id) {
            await interaction.reply({
                content: `You can't challenge yourself!`,
                ephemeral: true,
            });
            return;
        }

        const challengeProfile = await Challenge.findOne({
            userId1: interaction.user.id,
            userId2: targetUser.id
        }).sort({ startTime: -1 }); // Sort by startTime in descending order

        if (challengeProfile) {
            // if the users already have an active challenge between them
            if (challengeProfile.status === "pending" || challengeProfile.status === "ongoing") {
                await interaction.reply({
                    content: `You already have a challenge with <@${targetUser.id}> that is ${challengeProfile.status}!`,
                    ephemeral: true,
                });
                return;
            }

            const now = new Date();
            const oneMinuteAgo = new Date(now.getTime() - 60000);

            // if it was declined less than 60 seconds ago
            if (challengeProfile.status === "declined" && challengeProfile.startTime >= oneMinuteAgo) {
                const secondsLeft = Math.ceil((challengeProfile.startTime - oneMinuteAgo) / 1000);

                await interaction.reply({
                    content: `Please wait ${secondsLeft.toString()} seconds until you challenge <@${targetUser.id}> again!`,
                    ephemeral: true,
                });
                return;
            }
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