const { SlashCommandBuilder, italic, heading } = require('discord.js');
const { table } = require('table');
const { getClan } = require('../../services/clashRoyaleAPI');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('clan')
        .setDescription('Displays information about the clan, and all members of it.')
        .addStringOption((option) =>
			option.setName('clantag')
				.setDescription('The clan tag of the clan to display. (Default is Glacier 2)')
				.setRequired(false)),

    async execute(interaction, client) {

        const clanTagOption = interaction.options.getString('clantag');
        const clanTag = clanTagOption ?? 'G88J9CVP'; // Glacier 2 clan tag

        const clan = await getClan(clanTag);
        const memberList = clan.memberList;

        console.log(clan);
        // console.log(latestParticipants);

        const dataTable = [
            ['Member', 'Trophies', 'Role', 'Last Online'],
        ];

        let name = "";
        let role = "";
        let trophies = "";
        let lastOnline = "";

        for (const member of memberList) {
            name = member.name;
            trophies = member.trophies.toString();
            role = member.role;

            const date = new Date(
                member.lastSeen.replace(
                    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}\.\d{3}Z)$/,
                    '$1-$2-$3T$4:$5:$6'
                )
            );
            lastOnline = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

            dataTable.push([name, trophies, role, lastOnline]);
        }

        const config = {
            drawHorizontalLine: (lineIndex, rowCount) => {
                return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount;
            },
        };

        let message = `${heading(clan.name)}\n`;
        message += `\`\`\`${clan.description}\n`;
        message += `Members: ${clan.members}\n`;
        message += `Location: ${clan.location.name}\n`;
        message += `Donations Weekly: ${clan.donationsPerWeek}\n`;
        message += `Required Trophies: ${clan.requiredTrophies}\n`;
        message += `Clan War Trophies: ${clan.clanWarTrophies}\n`;
        message += `${table(dataTable, config)}\`\`\``;
        //     );

        await interaction.reply({
            content: message,
        })
    },
};