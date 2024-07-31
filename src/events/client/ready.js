const fs = require("fs");
const schedule = require('node-schedule');

module.exports = {
    name: 'ready',
    once: true,
    async execute(interaction, client) {
        console.log(`Logged in as ${client.user.tag}`);

        const jobsFolders = fs.readdirSync(`./src/jobs`);
        
        for (const folder of jobsFolders) {
            const jobFiles = fs
                .readdirSync(`./src/jobs/${folder}`)
                .filter((file) => file.endsWith('.js'));

            // set up the schedule for each job
            for (const file of jobFiles) {
                const job = require(`../../jobs/${folder}/${file}`);

                schedule.scheduleJob(job.schedule, async () => {
                    try {
                        job.execute(client);
                    } catch (err) {
                        console.error(`Error excuting job ${job.name}: ${err}`);
                    }
                });
            }
            
            // switch (folder) {
            //     case "clan":
            //         for (const file of jobFiles) {
            //             const job = require(`../../jobs/${folder}/${file}`);

            //             schedule.scheduleJob(job.schedule, async () => {
            //                 job.execute(client);
            //             });
            //         }
            //         break;

            //     default:
            //         console.log(`No event handler for folder '${folder}'`);
            //         break;
            // }
        }
    }
}