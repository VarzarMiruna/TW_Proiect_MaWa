const { getClasament } = require('../models/clasament');

const handleProduse = async (req, res) => {
    try {
        const result = await getClasament();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
    } catch (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'Aapplication/json' });
        res.end(JSON.stringify({ error: 'Database query failed' }));
    }
};

module.exports = handleProduse;
