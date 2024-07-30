module.exports = {
    data: {
        name: 'do-thing'
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `Clicked by ${interaction.user.globalName}!`
        });
    }
}