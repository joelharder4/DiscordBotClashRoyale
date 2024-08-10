module.exports = {
    async sendLongMessage(channel, message) {
        // max length of a discord message is 2000 characters
        if (message.length <= 2000) {
            await channel.send(message);
        } else {
            // split it into 1997 character chunks
            const messageChunks = message.match(/[\s\S]{1,1997}/g);

            for (i = 0; i < messageChunks.length; i++) {
                let chunk = messageChunks[i]

                // if it isn't the last chunk, add "..." to the end
                if (i !== messageChunks.length - 1) {
                    chunk += "...";
                }

                await channel.send(chunk);
            }
        }
    }
}