const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autocomplete')
        .setDescription('Return an autocomplete example!')
        .addStringOption(option => 
            option.setName('colour')
                .setDescription('Enter a colour!')
                .setAutocomplete(true)
                .setRequired(true)),
    async autocomplete(interaction, client) {
        const focusedValue = interaction.options.getFocused();
        const choices = ["Red", "Green", "Blue", "Yellow", "Purple", "Orange", "Black", "White"];
        const filtered = choices.filter(colour => colour.toLowerCase().includes(focusedValue.toLowerCase()));

        await interaction.respond(
            filtered.map((choice) => ({ name: choice, value: choice }))
        );
    },
    async execute(interaction, client) {
        const option = interaction.options.getString('colour');

        await interaction.reply({
            content: `You chose the colour: ${option}`,
        });
    },
};