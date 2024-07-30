const chalk = require('chalk');
const { getCurrentTimeString } = require('../../utils/formattedTime');

module.exports = {
    name: 'disconnected',
    execute(client) {
        
        const localTime = getCurrentTimeString();

        console.log(`${localTime}:   ` + chalk.red(`[Database]: Disconnected!`));
    },
};