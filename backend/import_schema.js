const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const hostsToTry = [
    'mysql-devops-ashir.mysql.database.azure.com',
    'mysql-taskapp-ashir.mysql.database.azure.com'
];

const credentials = {
    user: 'ashir',
    password: 'Khan123!',
    database: 'taskapp',
    ssl: {
        rejectUnauthorized: false
    }
};

async function run() {
    let connected = false;
    let connection;
    let selectedHost = '';

    for (const host of hostsToTry) {
        try {
            console.log(`Connecting to Azure MySQL server: ${host}...`);
            connection = await mysql.createConnection({
                host,
                ...credentials
            });
            console.log(`🎉 Connected successfully to ${host}!`);
            selectedHost = host;
            connected = true;
            break;
        } catch (err) {
            console.error(`❌ Failed to connect to ${host}: ${err.message}`);
        }
    }

    if (!connected) {
        console.error('\n❌ Could not connect to any Azure MySQL host.');
        console.error('================================================================');
        console.error('Troubleshooting checklist:');
        console.error('1. Is your Azure MySQL Flexible Server currently STOPPED?');
        console.error('   👉 Go to Azure Portal -> MySQL Flexible Server -> click "Start".');
        console.error('2. Firewall block: Is your client IP added to the server firewall?');
        console.error('   👉 Go to MySQL Flexible Server -> Networking -> enable "Allow public access from any Azure service" and click "Add current client IP".');
        console.error('3. Typo: Double-check if the server name is correct in your Azure console.');
        console.error('================================================================');
        process.exit(1);
    }

    try {
        const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
        console.log(`Reading schema from ${schemaPath}...`);
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split queries by semicolon, ignoring comments and empty lines
        const queries = schemaSql
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0 && !q.startsWith('--'));

        console.log(`Found ${queries.length} queries to execute.`);

        for (let query of queries) {
            if (query.toUpperCase().includes('CREATE DATABASE') || query.toUpperCase().startsWith('USE ')) {
                console.log(`Skipping admin query: ${query.substring(0, 40)}...`);
                continue;
            }
            console.log(`Executing: ${query.substring(0, 60)}...`);
            await connection.query(query);
        }

        console.log(`\n🎉 SUCCESS! Schema imported successfully to database "${credentials.database}" on ${selectedHost}!`);
        await connection.end();
    } catch (err) {
        console.error('❌ Error executing schema queries:', err.message);
        process.exit(1);
    }
}

run();
