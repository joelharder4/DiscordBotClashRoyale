const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permission')
        .setDescription('This command requires Administrator permission!')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction, client) {
        const { roles } = interaction.member;
        const role = await interaction.guild.roles.fetch('1026913670028066937')
            .catch(console.error);
        
        const testRole = await interaction.guild.roles.create({
            name: `Test`,
            permissions: [PermissionsBitField.Flags.KickMembers]
        }).catch(console.error);

        // maybe change from role.id to '1026913670028066937'
        if (roles.cache.has(role.id)) {

            await interaction.deferReply({
                fetchReply: true,
            });
            
            await roles.remove(role).catch(console.error);

            await interaction.editReply({
                content: `Removed ${role.name} from ${interaction.user.username}`,
            });

        } else {

            await interaction.reply({
                content: `You do not have the ${role.name} role!`,
            });

        }

        await roles.add(testRole).catch(console.error);

        // give the user the Ban Members permission
        await testRole
            .setPermissions([PermissionsBitField.Flags.BanMembers])
            .catch(console.error);

        const channel = await interaction.guild.channels.create({
            name: 'a-bot-made-this-channel',
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: testRole.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                }
            ]
        });

        await channel.permissionOverwrites
            .edit(testRole.id, { SendMessages: false })
            .catch(console.error);
    },
};