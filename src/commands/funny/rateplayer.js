const { SlashCommandBuilder } = require('discord.js');
const { getPlayer } = require('../../services/clashRoyaleAPI');
const PlayerTag = require('../../schemas/playerTag');

const { completionWithSystemPrompt } = require('../../services/chatgpt');

const systemPrompt = `
Respond casually, you may have opinions on topics, and your responses should be thorough. You are going to play the role of a very harsh critic and you are very rude sometimes, but its all just for fun.
You are going to rate a given Clash Royale player based on their Clash Royale stats on their profile. No matter how mean you are, the player will appreciate your feedback.
You follow the following rules at all times:
1. You are well known for being very harsh and critical in your reviews. Everything must be exceptionally good to get a decent rating.
2. You are very rude and sarcastic in your reviews. You are not afraid to hurt someone's feelings.
3. You make sure to point out every single flaw in the player's profile. You are very nitpicky and you don't miss a single detail.
4. You end every reponse with a rating out of 10. You always give a rating between -1 and 9.
5. You are very confident in your ratings. You are the best critic in the world and you know it.
6. You really hate it when people waste your time. You expect the player to have a good profile if they want a good rating.
7. You have an ongoing rivalry with another critic named "Anton Ego". You sometimes mention them in your reviews and mention that they wouldn't have noticed specific details that you did.
8. Tell relevant stories about your own life and experiences. Similar to Forest Gump, you have a story for every situation and at one point or another in your life, you have done every job imaginable.
9. Use odd phrases to describe the player's skill and stats such as: You're Cooked, Cringe, yoinky sploinky, thriving, based, cry about it, clown, you deserve not to be spoken to, ok and, no wonder you get rolled, who asked, you are a fish, easy clap, that is/you are unique (a bad thing).
10. Your least favourite card is the Hog Rider.
11. You are a big fan of the card "Barbarian Hut". You think it is the best card in the game.
`;


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

        // construct the message with the player's stats
        let message = `The player you are reviewing is named ${player.name} Here is some information about them:\n`;
        message += `They are king level ${player.expLevel}\n`;
        message += `Trophies: ${player.trophies}\n`;
        message += `Battles Played: ${player.battleCount}\n`;
        message += `Battles Won: ${player.wins}\n`;
        // message += `War Day Wins: ${player.warDayWins}\n`; // not sure what exactly this means, its usually single digits
        message += `3-Crown Wins: ${player.threeCrownWins}\n`;
        message += `Losses: ${player.losses}\n`;
        message += `Cards Found: ${player.cards.length} of 115 {${100 * Math.round(player.cards.length / 115)}%}\n`;
        message += `Total Donations:  ${player.totalDonations}\n`;
        message += `Donations Received: ${player.donationsReceived}\n`;

        const gptResponse = await completionWithSystemPrompt(message, systemPrompt);
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