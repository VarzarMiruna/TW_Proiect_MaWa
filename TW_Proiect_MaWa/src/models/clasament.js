const dbPool = require("../utils/dbSingleton");

exports.getClasament = async() => {
    try{
        const dbClient = await dbPool.connect();
        const query = `SELECT * FROM products ORDER BY voturi DESC`;
        const valuesQuery = [];

        const result = await dbClient.query(query, valuesQuery);

        dbClient.release();
        const filteredData = result.rows;

        return filteredData;
    } catch(error ){
        console.error("eroare", err)
    }
}

