const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('The bot will repeat the message you provide.')
        .addStringOption((option) =>
			option.setName('message')
				.setDescription('The message the bot will repeat.')
				.setRequired(true)),

    async execute(interaction, client) {
        
        const message = interaction.options.getString('message');

        interaction.deferReply();
        interaction.deleteReply();

        interaction.channel.send(message);
    },
};