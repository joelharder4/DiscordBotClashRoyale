const chalk = require('chalk');
const { getCurrentTimeString } = require('./time');


const logger = {
    error: (message) => {
        console.error(`${getCurrentTimeString()}   ` + chalk.red(`[Error] ${message}`));
    },

    warn: (message) => {
        console.warn(`${getCurrentTimeString()}   ` + chalk.yellow(`[Warning] ${message}`));
    },

    info: (message) => {
        console.info(`${getCurrentTimeString()}   ` + chalk.cyan(`[Info] ${message}`));
    },

    running: (message) => {
        console.log(`${getCurrentTimeString()}   ` + chalk.green(`[Running] ${message}`));
    },

    log: (message) => {
        console.log(`${getCurrentTimeString()}   ` + chalk.white(`${message}`));
    },
};

module.exports = logger;