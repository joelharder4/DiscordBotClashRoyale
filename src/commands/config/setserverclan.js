const { SlashCommandBuilder } = require('discord.js');
const Clan = require('../../schemas/clanTag');
const mongoose = require('mongoose');
const { getClan } = require('../../services/clashRoyaleAPI');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('setserverclan')
        .setDescription('The bot will save this clan tag as the default tag in this server.')
        .addStringOption((option) => // TODO: Change this to not required and present a modal if not set
			option.setName('tag')
				.setDescription('The Clash Royale Clan Tag without the hashtag.')
				.setRequired(true)),

    async execute(interaction, client) {
        const guildId = interaction.guild.id;
        let clanProfile = await Clan.findOne({ guildId: guildId });
        const newClanTag = interaction.options.getString('tag');

        // if the guild does not have a clan tag saved in the database
        if (!clanProfile) {

            let clan;

            // Check if the clan tag is valid
            try {
                clan = await getClan(newClanTag);
            } catch {
                await interaction.reply({
                    content: `Could not find a clan with the tag \`#${newClanTag}\`! Did not update the database.`,
                });
                return;
            }

            clanProfile = new Clan({
                _id: new mongoose.Types.ObjectId(),
                guildId: guildId,
                clanTag: newClanTag,
                guildName: interaction.guild.name,
                clanName: clan.name,
            });

            await clanProfile.save().catch(console.error);
            await interaction.reply({
                content: `Success! I will remember that this discord server is for the ${clan.name} clan (\`#${newClanTag}\`)!`,
            });
        
        } else if (clanProfile.clanTag !== newClanTag) { // if the server exists in the db but the clan tag is different

            const oldTag = clanProfile.clanTag;

            await interaction.reply({
                content: `There is already an existing clan tag \`#${oldTag}\` associated with this server! Attempting to overwrite...`,
            });

            let clan;
            // Check if the clan tag is valid
            try {
                clan = await getClan(newClanTag);
            } catch {
                await interaction.editReply({
                    content: `Could not find a clan with the tag \`#${newClanTag}\`! Did not update the database.`,
                });
                return;
            }

            // change the clan tag in the database to the new one
            const updatedProfile = await Clan.findOneAndUpdate(
                { guildId: guildId }, // filter
                { 
                    clanTag: newClanTag,
                    guildName: interaction.guild.name,
                    clanName: clan.name,
                }, // update
                { new: true, upsert: true } // options
            );

            if (updatedProfile) {
                await interaction.editReply({
                    content: `You have changed the Clan Tag in this server from \`#${oldTag}\` to \`#${newClanTag}\`! If that is incorrect please use the command again.`,
                });
            } else {
                await interaction.editReply({
                    content: `Database Failed to change Clan Tag from \`#${oldTag}\` to \`#${newClanTag}\`. Sorry :(`,
                });
            }

        } else { // if the clan tag is the same as the one already the database

            await interaction.reply({
                content: `Clan tag \`#${newClanTag}\` is already the clan tag for this server. No changes are needed.`,
            });

        }
    },
};