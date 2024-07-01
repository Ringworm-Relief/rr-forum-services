const { Pool } = require('pg');

const pool = new Pool({
    user: 'asherspurr',
    host: 'localhost',
    database: 'template1',
    password: 'mbs01864',
    port: 5432,
});

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Connected to the database successfully');
        client.release();
    } catch (err) {
        console.error('Error connecting to the database', err);
    }
}

testConnection();
