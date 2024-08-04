const { SlashCommandBuilder } = require('discord.js');
const { getPlayer } = require('../../services/clashRoyaleAPI');
const PlayerTag = require('../../schemas/playerTag');
const { completionWithSystemPrompt } = require('../../services/chatgpt');
const { harshPlayerCriticPrompt } = require('../../utils/chatGPTPrompts');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('rateplayer')
        .setDescription('Gets ChatGPT to rate how skilled a player is based on their Clash Royale profile.')
        .addStringOption((option) =>
			option.setName('playertag')
				.setDescription('The player tag of the player without a hashtag. (Default is Yourself)')
				.setRequired(false)),

    async execute(interaction, client) {

        const userPlayerProfile = await PlayerTag.findOne({ userId: interaction.user.id });
        const playerTagOption = interaction.options.getString('playertag');

        if (!userPlayerProfile && !playerTagOption) {
            await interaction.reply({
                content: `You must either provide a player tag in the command, or set a default player tag for yourself using \`/setplayertag\`!`,
                ephemeral: true,
            });
            return;
        }

        const playerTag = playerTagOption ?? userPlayerProfile.playerTag;

        const player = await getPlayer(playerTag);

        if (!player) {
            await interaction.reply({
                content: `Could not find a player with the tag \`#${playerTag}\`!`,
                emphemeral: true,
            });
            return;
        }

        // in case ChatGPT takes a long time to respond
        await interaction.deferReply();

        const leagueNames = {
            1: "Challenger I",
            2: "Challenger II",
            3: "Challenger III",
            4: "Master I",
            5: "Master II",
            6: "Master III",
            7: "Champion",
            8: "Grand Champion",
            9: "Royal Champion",
            10: "Ultimate Champion",
        };

        // construct the message with the player's stats
        let message = `The player you are reviewing is named ${player.name}. Here is some information about them:\n`;
        message += `They are king level ${player.expLevel}.\n`;
        message += `Their clan is named ${player.clan.name}\n`;
        message += `They only have ${player.trophies} trophies currently\n`;
        message += `Best Trophies: ${player.bestTrophies}\n`;
        message += `Legacy Best Trophies (from the old system): ${player.legacyTrophyRoadHighScore}\n`;
        message += `Battles Played: ${player.battleCount}\n`;
        message += `Battles Won: ${player.wins}\n`;
        message += `3-Crown Wins: ${player.threeCrownWins}\n`;
        message += `Losses: ${player.losses}\n`;
        message += `Cards Found: ${player.cards.length} of 115 {${100 * Math.round(player.cards.length / 115)}%}\n`;
        message += `Total Donations:  ${player.totalDonations}\n`;
        message += `Donations Received: ${player.donationsReceived}\n`;
        message += `Current Favourite Card: ${player.currentFavouriteCard.name}\n`;
        message += `Path of Legends:\n`;
        message += ` This Season: ${leagueNames[player.currentPathOfLegendSeasonResult.leagueNumber]}\n`;
        message += ` Last Season: ${leagueNames[player.lastPathOfLegendSeasonResult.leagueNumber]}\n`;
        message += ` Best Season: ${leagueNames[player.bestPathOfLegendSeasonResult.leagueNumber]}\n`;
        message += `Goblin Queen's Journey:\n`;
        message += ` Trophies: ${player.progress['goblin-road'].trophies}\n`;
        message += ` Best Trophies: ${player.progress['goblin-road'].bestTrophies}\n`;

        const gptResponse = await completionWithSystemPrompt(message, harshPlayerCriticPrompt);
        const gptMessage = gptResponse.choices[0].message.content;

        // console.log('ChatGPT response:', gptResponse);

        // max length of a discord message is 2000 characters
        if (gptMessage.length > 1940) {
            const firstPart = gptMessage.slice(0, 1990);
            const remainingPart = gptMessage.slice(1990);
            
            // delete the "Bot is thinking..." message
            await interaction.deleteReply();
            await interaction.channel.send(firstPart + "...").catch(console.error);
            await interaction.channel.send(remainingPart).catch(console.error);
            
        } else {

            await interaction.editReply({
                content: `## Official rating of ${player.name} (#${player.tag})\n` + gptMessage,
            });
            
        }
    },
};