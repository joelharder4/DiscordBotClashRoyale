const { SlashCommandBuilder } = require('discord.js');
const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('database')
        .setDescription('Returns information from a database!'),
    async execute(interaction, client) {
        let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });

        if (!guildProfile) {
            guildProfile = new Guild({
                _id: new mongoose.Types.ObjectId(),
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                guildIcon: interaction.guild.iconURL() ?? "None"
            });
            console.log(`Created a new guild profile for ${guildProfile.guildName}`);
        } else {
            console.log(`Found guild profile for ${guildProfile.guildName}`);
        }

        await guildProfile.save().catch(console.error);
        await interaction.reply({
            content: `Server ${guildProfile.guildName} has been added to the database!`,
        });
    },
};