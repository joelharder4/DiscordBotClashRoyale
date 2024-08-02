const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Return a select menu!'),
    async execute(interaction, client) {
        const menu = new StringSelectMenuBuilder()
            .setCustomId('menu-example')
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(
                new StringSelectMenuOptionBuilder({
                    label: 'It Wednesday',
                    value: 'Holay Molay',
                }), new StringSelectMenuOptionBuilder({
                    label: 'Friday!!!',
                    value: 'Me when it Daniel Friday',
                })
            );
        
        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(menu)]
        });
    }
}