const logger = require('../../utils/logger');

module.exports = {
    name: 'messageCreate',
    once: false,
    async execute(message, client) {

        if (message.author.bot) return;

        const content = message.content.toLowerCase();
        if (!content) {
            logger.info(`Message from ${message.author.globalName} has no content or bot is not allowed to read it.`);
            return;
        }


        if (content.includes("heheheha")) {
            const heheheha = client.emojis.cache.find(
                (emoji) => emoji.id = '1269055380915359877'
            );
            message.react(heheheha).catch(console.error);
        }

        if (content.includes("grr")) {
            const grr = client.emojis.cache.find(
                (emoji) => emoji.id = '1269055688286535690'
            );
            message.react(grr).catch(console.error);
        }

        if (content.includes("mimimi")) {
            const mimimimi = client.emojis.cache.find(
                (emoji) => emoji.id = '1266131684529537065'
            );
            message.react(mimimimi).catch(console.error);
        }

        if (content.includes("yippe") || content.includes("yipe")) {
            const yippee = client.emojis.cache.find(
                (emoji) => emoji.id = '1269827923985305658'
            );
            message.react(yippee).catch(console.error);
        }
        
        if (content.includes("among us") || content.includes("amogus") || content.includes("amorgos")) {
            const amogus = client.emojis.cache.find(
                (emoji) => emoji.id = '1270835641361367112'
            );
            message.react(amogus).catch(console.error);
        }
    }
}