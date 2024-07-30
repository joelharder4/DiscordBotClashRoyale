const fs = require("fs");
const schedule = require('node-schedule');
const EnabledJobs = require('../../schemas/enabledJobs');

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
            
            switch (folder) {
                case "clan":
                    for (const file of jobFiles) {
                        const job = require(`../../jobs/${folder}/${file}`);

                        schedule.scheduleJob(job.schedule, async () => {

                            try {
                                // Retrieve all documents
                                const enabledJobsArray = await EnabledJobs.find({});

                                // Loop through all guildIds
                                enabledJobsArray.forEach(jobs => {

                                    if (jobs.jobNames.includes(job.name)) {
                                        job.execute(client, jobs.guildId);
                                    } else {
                                        console.log(`Job '${job.name}' is disabled`);
                                    }

                                });
                            } catch (err) {
                                console.error('Error retrieving documents:', err);
                            }
                        });
                    }
                    break;

                default:
                    console.log(`No event handler for folder '${folder}'`);
                    break;
            }
        }
    }
}