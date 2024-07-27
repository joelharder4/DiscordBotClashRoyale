module.exports = {
    data: {
        name: "menu-example",
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `WOAH --> ${interaction.values[0]}`,
        });
    }
}