import { exec } from "child_process";
import cron from "node-cron";

console.log("Cronjob is running...");
const envFile = process.env.NODE_ENV == "production" ? ".env.prod" : ".env.local";

const runDummyCollection = () => {
    console.log("Running daily dummy data script...");    
    exec(`python3 scripts/create_dummy_data.py --env_file ${envFile}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`Script error: ${stderr}`);
          return;
        }
        console.log(`Script output: ${stdout}`);
      });
}

// Schedule the job every day at midnight
cron.schedule("0 0 * * *", () => {
    runDummyCollection()
});

// Run collection on restart
runDummyCollection()