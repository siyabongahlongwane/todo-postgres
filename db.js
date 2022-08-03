const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'jvPh60sb!',
    database: 'postgres',
    host: 'localhost',
    port: 8081
});

module.exports = pool;
