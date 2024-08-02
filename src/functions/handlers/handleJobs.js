const fs = require("fs");
const schedule = require('node-schedule');


module.exports = (client) => {
    client.handleJobs = async () => {

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
        }
    }
}