const dbPool = require("../utils/dbSingleton");

exports.getProduse = async() => {
    try{
        const dbClient = await dbPool.connect();
        const query = `SELECT * FROM products ORDER BY id ASC`;
        const valuesQuery = [];

        const result = await dbClient.query(query, valuesQuery);

        dbClient.release();
        const filteredData = result.rows;

        return filteredData;
    } catch(error ){
        console.error("eroare", err)
    }
}

