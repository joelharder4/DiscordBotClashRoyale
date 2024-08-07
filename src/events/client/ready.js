const logger = require('../../utils/logger');

module.exports = {
    name: 'ready',
    once: true,
    async execute(interaction, client) {
        logger.log(`Logged in as ${client.user.tag}`);
    }
}