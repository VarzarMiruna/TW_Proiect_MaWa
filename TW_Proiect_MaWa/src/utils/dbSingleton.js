const { Pool } = require("pg");
const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'MAWA',
    password: 'miruna',
    port: 5432,
    max: 30,
    min: 30
  };

const dbPool = new Pool(dbConfig)

module.exports = dbPool