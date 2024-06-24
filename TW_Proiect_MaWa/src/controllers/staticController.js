const path = require("path");
const fs = require("fs");

const handleStaticRequest = (req, res) => {

    const url = req.url;
    if(url=="/zi")
    {
      serveViewToClient(req, res, "zi.html")

    }
    else if(url == "/seara"){
          serveViewToClient(req, res, "seara.html")
    }
    else if(url == "/tutorial"){
         serveViewToClient(req, res, "tutorial.html")
    }
    else if(url == "/populare")
    {
        serveViewToClient(req, res, "populare.html")

    }
    else if(url=="/register")
    {
      serveViewToClient(req, res, "register.html")

    }
    else if(url=="/login")
    {
      clearCookies(res);
      serveViewToClient(req, res, "login.html")

    }else if(url=="/contact")
    {
      serveViewToClient(req, res, "contact.html")

    }
    else if(url=="/pag_princ")
    {
      serveViewToClient(req, res, "index.html")
    }
    else if(url=="/favorite")
    {
        serveViewToClient(req, res, "favorite.html")
  
    }
    else if(url=="/produse")
    {
        serveViewToClient(req, res, "produse.html")
    
    }
    else if(url == "/doc")
    {
          serveViewToClient(req, res, "doc.html")
    }else if(url == "/contul_meu"){
      serveViewToClient(req, res, "cont.html")
    }
    else {
      const fileUrl = "/src/public" + url;
      const filepath = path.resolve("." + fileUrl);

      const extension = path.extname(filepath);
      fs.access(filepath, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end("error loading page")
        } else {
          fs.readFile(filepath, (err, fileData) => {
            if (err) {
              res.statusCode = 500;
              res.end("server Error");
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", fileType[extension]);
              res.end(fileData);
            }
          });
        }
      });
    }

}

const serveViewToClient  = (req, res, filePath) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  const totalFilePath =  path.resolve("." + `/src/view/${filePath}`);
  fs.readFile(totalFilePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end("server Error1");
    } else {
      res.end(data);
    }
  });
};

const clearCookies = (res) => {
  res.setHeader("Set-Cookie", [`sessionId=''; Max-Age=0; Path=/; HttpOnly;`, `token=''; Max-Age=0; Path=/; HttpOnly;`]);
};

const fileType = {
    ".css": "text/css",
    ".png": "image/png",
    ".jpg": "image/jpg",
    ".jpeg": "image/jpeg",
    ".js": "application/javascript",
    ".html":"text/html"
  };

module.exports = handleStaticRequest
