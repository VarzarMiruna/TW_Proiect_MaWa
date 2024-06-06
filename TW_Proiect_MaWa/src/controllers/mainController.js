const apiController = require("./apiController")
const handleStaticRequest = require("./staticController")

const mainController = (req, res) =>{
    if(req.url.startsWith("/api")){
        apiController(req, res);
    }
    else{
        handleStaticRequest(req, res);
    }
}

module.exports = mainController
