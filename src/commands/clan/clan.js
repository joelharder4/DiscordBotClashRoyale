const { SlashCommandBuilder, heading, bold } = require('discord.js');
const { getClan } = require('../../services/clashRoyaleAPI');
const { clanMembersTable } = require('../../utils/clashRoyaleTables');
const Clan = require('../../schemas/clanTag');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clan')
        .setDescription('Displays information about the clan, and all members of it.')
        .addStringOption((option) =>
			option.setName('clantag')
				.setDescription('The clan tag of the clan to display. (Default is Glacier 2)')
				.setRequired(false)),

    async execute(interaction, client) {

        const guildClanProfile = await Clan.findOne({ guildId: interaction.guild.id });
        const clanTagOption = interaction.options.getString('clantag');

        if (!guildClanProfile && !clanTagOption) {
            await interaction.reply({
                content: `You must either provide a clan tag in the command, or set a default clan tag for this server using \`/setserverclan\`!`,
                ephemeral: true,
            });
            return;
        }

        // 'G88J9CVP' is Glacier 2 clan tag
        const clanTag = clanTagOption ?? guildClanProfile.clanTag;

        const clan = await getClan(clanTag);

        if (!clan) {
            await interaction.reply({
                content: `Could not find a clan with the tag \`#${clanTag}\`!`,
            });
            return;
        }

        const asciiTable = await clanMembersTable(clan);

        let message = `${heading(clan.name)}\n`;
        message += `${bold(clan.tag)}\n`;
        message += `\`\`\`${clan.description}\n`;
        message += `Members:  ${clan.members}\n`;
        message += `Location: ${clan.location.name}\n`;
        message += `Donations Weekly:  ${clan.donationsPerWeek}\n`;
        message += `Required Trophies: ${clan.requiredTrophies}\n`;
        message += `Clan War Trophies: ${clan.clanWarTrophies}\n`;
        message += `${asciiTable}\`\`\``;

        await interaction.reply({
            content: message,
        });
    },
};