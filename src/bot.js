require("dotenv").config();

const { token, databaseToken } = process.env;
const { connect } = require("mongoose");
const { Client, Collection } = require("discord.js");
const fs = require("fs");

// const { Guilds, GuildMessages, GuildMessageReactions } = GatewayIntentBits
const client = new Client({ intents: 32767 });
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];
client.testCommandArray = [];
client.testMode = true; // change to false when deploying
client.testGuildId =  "1025906566232285224";

const functionsFolder = fs.readdirSync("./src/functions");
for (const folder of functionsFolder) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith('.js'));
    for (const file of functionFiles) {
        require(`./functions/${folder}/${file}`)(client);
    }
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.handleJobs();
client.login(token);

(async () => {
  connect(databaseToken).catch(console.error);
})();