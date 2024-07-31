const chalk = require('chalk');
const { getCurrentTimeString } = require('../../utils/time');

module.exports = {
    name: 'error',
    execute(error) {

        const localTime = getCurrentTimeString();

        console.log(`${localTime}:   ` + chalk.red(`[Database]: Error!\n${error}`));
    },
};