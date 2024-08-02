const Challenge = require('../../schemas/challenge');
const Player = require('../../schemas/playerTag');

module.exports = {
    data: {
        name: 'accept-challenge',
    },
    async execute(interaction, client) {
        const message = interaction.message.content;
        const regex = /<@(\d+)>/g;
        const matches = [...message.matchAll(regex)];

        const challengedId = matches[0][1];
        const challengerId = matches[1][1];
        const clickerId = interaction.user.id;

        if (clickerId !== challengedId) {
            await interaction.reply({
                content: `You silly goose! You aren't the one who was challenged!`,
                ephemeral: true,
            });
            return;
        }

        const challengedProfile = await Player.findOne({ userId: challengedId });

        if (!challengedProfile) {
            await interaction.reply({
                content: `You need to set your player tag before you can accept challenges!\nUse \`/setplayertag\` to set your player tag.`,
                ephemeral: true,
            });
        }

        const filter = { 
            userId1: challengerId,
            userId2: challengedId,
            status: "pending",
        };
        const update = { status: "ongoing" };
        const options = { new: true, upsert: true }; // `new` returns the updated document, `upsert` creates a new document if none is found

        const updatedProfile = await Challenge.findOneAndUpdate(filter, update, options).catch(console.error);

        const channel = client.channels.cache.get(interaction.message.channelId);

        await interaction.message.delete().catch(console.error);

        if (updatedProfile) {
            await channel.send(`New Challenge Created between <@${challengerId}> and <@${challengedId}>!`);
        } else {
            await channel.send(`Could not find a challenge to accept! Sorry :(`);
        }
    }
}