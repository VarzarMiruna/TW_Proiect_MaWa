const {getMakeupVarsta} = require("../models/makeupVarsta")
const {getMakeupTipTen} = require("../models/makeupTipTen")
const {getMakeupProduse} = require("../models/makeupProduse")

module.exports = { handleMakeupZiVarsta, handleMakeupTipTen,handleMakeupProduse};


const handleMakeupZiVarsta = async (req, res) => {

  const filteredRows1 = await getMakeupVarsta();

  res.end(JSON.stringify(filteredRows1))

}

const handleMakeupTipTen = async (req, res) => {

  const filteredRows2 = await getMakeupTipTen();

  res.end(JSON.stringify(filteredRows2))

}
const handleMakeupProduse = async (req, res) => {

  const filteredRows3 = await getMakeupProduse();

  res.end(JSON.stringify(filteredRows3))
}

