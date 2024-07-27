module.exports = {
    data: {
        name: "modal-example",
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `Your favourite colour is ${interaction.fields.getTextInputValue("favColourInput")}!`,
        });
    }
}