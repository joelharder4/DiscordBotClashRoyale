const chalk = require('chalk');
const { getCurrentTimeString } = require('../../utils/time');

module.exports = {
    name: 'connecting',
    execute(client) {
        
        const localTime = getCurrentTimeString();

        console.log(`${localTime}   ` + chalk.cyan(`[Database]: Connecting...`));
    },
};