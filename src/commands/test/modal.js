const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modal')
        .setDescription('Return an example modal!'),
    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId('modal-example')
            .setTitle('Favourite Colour');

        const textInput = new TextInputBuilder()
            .setCustomId('favColourInput')
            .setLabel('What is your favourite colour?')
            .setPlaceholder('Favourite Colour Here')
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        
        modal.addComponents(new ActionRowBuilder().addComponents(textInput));

        await interaction.showModal(modal);
    },
}