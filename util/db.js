const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'storedb',
  password: '911666',
  port: 5432,
});

module.exports = pool;