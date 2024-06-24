const pool = require('../utils/dbSingleton');

const handleVote = async (req, res) => {
    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { id } = JSON.parse(body);
        try {
            await pool.query('UPDATE products SET voturi = voturi + 1 WHERE id = $1', [id]);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Vot înregistrat' }));
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Database update failed' }));
        }
    });
};

module.exports = handleVote;
