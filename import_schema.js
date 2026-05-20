const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const config = {
    host: 'mysql-taskapp-ashir.mysql.database.azure.com',
    user: 'taskadmin',
    password: 'Ashirapp123!',
    database: 'taskapp',
    ssl: {
        rejectUnauthorized: false
    }
};

async function run() {
    try {
        console.log('Connecting to Azure MySQL server: ' + config.host);
        const connection = await mysql.createConnection(config);
        console.log('Connected successfully to Azure MySQL!');

        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        console.log(`Reading schema from ${schemaPath}...`);
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Split queries by semicolon, ignoring comments and empty lines
        const queries = schemaSql
            .split(';')
            .map(q => q.trim())
            .filter(q => q.length > 0 && !q.startsWith('--'));

        console.log(`Found ${queries.length} queries to execute.`);

        for (let query of queries) {
            // Skip database creation / selection queries as Azure has already allocated the database
            if (query.toUpperCase().includes('CREATE DATABASE') || query.toUpperCase().startsWith('USE ')) {
                console.log(`Skipping admin query: ${query.substring(0, 40)}...`);
                continue;
            }
            console.log(`Executing: ${query.substring(0, 60)}...`);
            await connection.query(query);
        }

        console.log('🎉 Schema imported successfully! Tables created on Azure MySQL!');
        await connection.end();
    } catch (err) {
        console.error('❌ Error during schema import:', err.message);
        console.error('\nTroubleshooting Tip: Make sure you have enabled "Allow public access from any Azure service" and added your local client IP in Azure MySQL networking settings.');
        process.exit(1);
    }
}

run();
