const chalk = require('chalk');
const { getCurrentTimeString } = require('../../utils/formattedTime');

module.exports = {
    name: 'connected',
    execute(client) {

        const localTime = getCurrentTimeString();

        console.log(`${localTime}:   ` + chalk.green(`[Database]: Connected!`));
    },
};