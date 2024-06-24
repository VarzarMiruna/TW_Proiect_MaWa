const handleZiSfaturi = require("./ziController");
const handleSearaSfaturi = require("./searaController");
const handleProduse = require("./produseController");
const handleVote = require("./voteController"); 
const handleClasament = require("./clasamentController");

const apiController = (req, res) => {
    if (req.url.startsWith("/api/zi-sfaturi")) {
        handleZiSfaturi(req, res);
    } else if (req.url.startsWith("/api/seara-sfaturi")) {
        handleSearaSfaturi(req, res);
    } else if (req.url.startsWith("/api/makeup-produse")) {
        handleProduse(req, res);
    } else if (req.url.startsWith("/api/vote")) { 
        handleVote(req, res);
    } else if (req.url.startsWith("/api/clasament")) { 
        handleClasament(req, res);
    }else {
        res.end("nu exista acest endpoint creat");
    }
};

module.exports = apiController;
