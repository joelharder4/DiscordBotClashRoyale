module.exports = {
    async sendLongMessage(message, channel) {
        // max length of a discord message is 2000 characters
        if (message.length <= 2000) {
            await channel.send(message);
        } else {
            // split it into 2000 character chunks
            const messageChunks = message.match(/[\s\S]{1,2000}/g);

            for (const chunk of messageChunks) {
                await channel.send(chunk);
            }
        }
    }
}