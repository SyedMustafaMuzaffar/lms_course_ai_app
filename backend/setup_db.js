const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const setup = async () => {
    let connection;
    try {
        console.log('Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            multipleStatements: true,
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
        });

        console.log('Creating database if not exists (might be skipped on managed DBs)...');
        try {
            await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'lms_db'};`);
        } catch (dbError) {
            console.log('Skipping CREATE DATABASE (likely managed cloud database).');
        }
        await connection.query(`USE ${process.env.DB_NAME || 'lms_db'};`);

        console.log('Reading schema.sql...');
        const schemaPath = path.join(__dirname, 'models', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema...');
        await connection.query(schema);

        console.log('Database and tables created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n--- Troubleshooting ---');
            console.log('Authentication failed. Attempting with NO password...');
            try {
                if (connection) await connection.end();
                connection = await mysql.createConnection({
                    host: process.env.DB_HOST || 'localhost',
                    user: process.env.DB_USER || 'root',
                    multipleStatements: true
                });
                await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'lms_db'};`);
                await connection.query(`USE ${process.env.DB_NAME || 'lms_db'};`);
                const schemaPath = path.join(__dirname, 'models', 'schema.sql');
                const schema = fs.readFileSync(schemaPath, 'utf8');
                await connection.query(schema);
                console.log('Database and tables created successfully (with no password)!');
                process.exit(0);
            } catch (retryError) {
                console.error('Still failed with no password:', retryError.message);
            }
        }
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
};

setup();
