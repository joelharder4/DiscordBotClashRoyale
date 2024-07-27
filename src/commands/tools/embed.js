const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Displays an embed!'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Weekly War Summary')
            .setDescription('This is a summary of the clan war this week!')
            .setColor(0x69F420)
            .setImage(client.user.displayAvatarURL())
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setAuthor({
                url: 'https://www.lingscars.com/',
                iconURL: client.user.displayAvatarURL(),
                name: interaction.user.tag,
            })
            .setFooter({
                url: 'https://www.lingscars.com/',
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })
            .setURL('https://www.lingscars.com/')
            .addFields(
                { name: 'Clan Name', value: 'Glacier 2', inline: false },
                { name: 'Players', value: 'Mircat\nTheAngryPopo\nSmuffie', inline: true },
                { name: 'Medals', value: '2500\n2350\n600', inline: true },
                { name: 'Roles', value: 'Co-Leader\nLeader\nElder', inline: true },
            );

        await interaction.reply({
            embeds: [embed]
        });
    }
}