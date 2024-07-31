const { SlashCommandBuilder } = require('discord.js');
const Player = require('../../schemas/playerTag');
const mongoose = require('mongoose');
const { getPlayer } = require('../../services/clashRoyaleAPI');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('playertag')
        .setDescription('The bot will remember your Clash Royale Player Tag to use in other commands.')
        .addStringOption((option) => // TODO: Change this to not required and present a modal if not set
			option.setName('tag')
				.setDescription('Your Clash Royale Player Tag without the hashtag.')
				.setRequired(true)),

    async execute(interaction, client) {
        const userId = interaction.user.id;
        const userGlobalName = interaction.user.globalName;
        let playerProfile = await Player.findOne({ userId: userId });
        const newPlayerTag = interaction.options.getString('tag');

        if (!playerProfile) {
            // if the user does not have a player tag saved in the database

            let player;
            // Check if the player tag is valid
            try {
                player = await getPlayer(newPlayerTag);
            } catch {
                await interaction.reply({
                    content: `Could not find a player with the tag \`#${newPlayerTag}\`! Did not update the database.`,
                });
                return;
            }

            playerProfile = new Player({
                _id: new mongoose.Types.ObjectId(),
                userId: userId,
                playerTag: newPlayerTag,
                userName: userGlobalName,
                playerName: player.name,
            });

            await playerProfile.save().catch(console.error);
            await interaction.reply({
                content: `Success! Now I will remember that you are ${player.name} (\`#${newPlayerTag}\`)!`,
            });
        
        } else if (playerProfile.playerTag !== newPlayerTag) {
            // if the player tag is different, update it

            const oldTag = playerProfile.playerTag;

            await interaction.reply({
                content: `You already have a player tag \`#${oldTag}\` saved in the database! Attempting to overwrite...`,
            });

            let player;
            // Check if the player tag is valid
            try {
                player = await getPlayer(newPlayerTag);
            } catch {
                await interaction.editReply({
                    content: `Could not find a player with the tag \`#${newPlayerTag}\`! Did not update the database.`,
                });
                return;
            }

            const filter = { userId: userId };
            const update = {
                playerTag: newPlayerTag,
                userName: userGlobalName,
                playerName: player.name,
            };
            const options = { new: true, upsert: true }; // `new` returns the updated document, `upsert` creates a new document if none is found

            const updatedProfile = await Player.findOneAndUpdate(filter, update, options).catch(console.error);

            if (updatedProfile) {
                await interaction.editReply({
                    content: `You have changed your Player Tag from \`#${oldTag}\` to \`#${newPlayerTag}\`! If that is incorrect please use the command again, ${player.name}.`,
                });
            } else {
                await interaction.editReply({
                    content: `Database Failed to change Player Tag from \`#${oldTag}\` to \`#${newPlayerTag}\`.`,
                });
            }

        } else {
            // if the player tag is the same as the one in the database

            await interaction.reply({
                content: `Player tag \`#${newPlayerTag}\` is already your player tag in the database!`,
            });

        }
    },
};