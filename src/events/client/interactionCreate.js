const { InteractionType, MessageFlags } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {

            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return new Error('Unknown Command!');

            try {
                await command.execute(interaction, client);
            } catch (error) {
                const errorMessage = { 
                    content: 'There was an error while executing this command!', 
                    flags: [MessageFlags.Ephemeral],
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage).catch(err => console.error('Failed to send followUp:', err));
                } else {
                    await interaction.reply(errorMessage).catch(err => console.error('Failed to send reply:', err));
                }
            }

        } else if (interaction.isButton()) {

            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);

            if (!button) return new Error('Unknown Button!');

            try {
                await button.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }

        } else if (interaction.isStringSelectMenu()) {
            
            const { selectMenus } = client;
            const { customId } = interaction;
            const menu = selectMenus.get(customId);

            if (!menu) return new Error('Unknown Select Menu!');

            try {
                await menu.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }

        } else if (interaction.type == InteractionType.ModalSubmit) {
                    
                const { modals } = client;
                const { customId } = interaction;
                const modal = modals.get(customId);
    
                if (!modal) return new Error('Unknown Modal!');
    
                try {
                    await modal.execute(interaction, client);
                } catch (error) {
                    console.error(error);
                }
        
        } else if (interaction.isContextMenuCommand()) {

            const { commands } = client;
            const { commandName } = interaction;
            const contextCommand = commands.get(commandName);
            if (!contextCommand) return new Error('Unknown Context Command!');

            try {
                await contextCommand.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }

        } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {

            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return new Error('Unknown Command!');

            try {
                await command.autocomplete(interaction, client);
            } catch (error) {
                console.error(error);
            }

        } else {
            console.log('Unknown Interaction: ', interaction);
        }
    }
}