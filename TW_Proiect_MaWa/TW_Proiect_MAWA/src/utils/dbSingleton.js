const { Pool } = require("pg");
const dbConfig = {
    user: 'postgres',
    host: 'postgres-1.cn62tejxkxhb.eu-north-1.rds.amazonaws.com',
    database: 'MAWA',
    password: 'miruna',
    port: 5432,
    max: 30,
    min: 30
  };

const dbPool = new Pool(dbConfig)

module.exports = dbPool