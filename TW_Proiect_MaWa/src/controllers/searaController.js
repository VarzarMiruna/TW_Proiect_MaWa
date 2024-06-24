const { getMakeupVarsta } = require("../models/makeupVarsta");
const { getMakeupTipTen } = require("../models/makeupTipTen");
const { getMakeupOcazie } = require("../models/makeupOcazie");
const { getMakeupPret } = require("../models/makeupPret");

const handleSearaSfaturi = async (req, res) => {
  const tipMachiaj = "seara";

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const params = new URLSearchParams(body);
    const selector1Value = params.get("selector1");
    const selector2Value = params.get("selector2");
    const selector3Value = params.get("selector3");
    const selector4Value = params.get("selector4");

    try {
      const sfaturiVarsta = await getMakeupVarsta(selector1Value, tipMachiaj);
      const sfaturiTipTen = await getMakeupTipTen(selector2Value, tipMachiaj);
      const sfaturiOcazie = await getMakeupOcazie(selector3Value, tipMachiaj);
      const sfaturiPret   = await getMakeupPret(selector4Value, tipMachiaj);
      
      const sfaturi = {
        varsta: sfaturiVarsta[0]?.descriere || "N/A",
        tipTen: sfaturiTipTen[0]?.descriere || "N/A",
        ocazie: sfaturiOcazie[0]?.descriere || "N/A",
        pret: sfaturiPret[0]?.descriere || "N/A",
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(sfaturi));
    } catch (error) {
      console.error("Eroare în handleSearaSfaturi:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });
};

module.exports = handleSearaSfaturi;