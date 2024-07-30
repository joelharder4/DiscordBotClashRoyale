const Challenge = require('../../schemas/challenge');

module.exports = {
    data: {
        name: 'deny-challenge',
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

        const filter = { 
            userId1: challengerId,
            userId2: challengedId,
            status: "pending",
        };
        const update = { status: "declined" };
        const options = { new: true, upsert: true }; // `new` returns the updated document, `upsert` creates a new document if none is found
        const updatedProfile = await Challenge.findOneAndUpdate(filter, update, options).catch(console.error);

        // delete the original message
        await interaction.message.delete().catch(console.error);

        const channel = client.channels.cache.get(interaction.message.channelId);
        if (updatedProfile) {
            await channel.send(`<@${challengedId}> has declined <@${challengerId}>'s challenge. Cry about it.`);
        } else {
            await channel.send(`An Error Occured finding the challenge in the Database! Sorry :(`);
        }
    }
}