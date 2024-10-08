const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const logger = require("../../utils/logger");

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandsFolders = fs.readdirSync(`./src/commands`);

        for (const folder of commandsFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith('.js'));
            
            const { commands, commandArray, testCommandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);

                if (folder === 'test' || client.testMode) {
                    testCommandArray.push(command.data.toJSON());
                } else {
                    commandArray.push(command.data.toJSON());
                }
            }
        }

        const clientId = '1266128164057251991';
        const guildId = client.testGuildId; // guild id for private sussy server

        const rest = new REST({ version: '9' }).setToken(process.env.token);
        try {
            logger.log('Started refreshing application (/) commands.');

            // clear any existing guild commands
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: client.testCommandArray, }
            );

            await rest.put(
                Routes.applicationCommands(clientId), // change to applicationGuildCommands(clientId, guildId) to register commands to a specific guild
                { body: client.commandArray, }
            );

            logger.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }
}