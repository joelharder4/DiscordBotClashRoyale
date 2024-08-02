module.exports = {
    name: 'ready',
    once: true,
    async execute(interaction, client) {
        console.log(`Logged in as ${client.user.tag}`);
    }
}