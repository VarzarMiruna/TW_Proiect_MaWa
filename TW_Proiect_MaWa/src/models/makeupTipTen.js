const dbPool = require("../utils/dbSingleton");

const getMakeupTipTen = async (categorieTipTen, tipMachiaj) => {

  const query = `
      SELECT descriere
      FROM tip_ten
      WHERE categorie = $1
      AND machiaj = $2
    `;
  try {
    const result = await dbPool.query(query, [categorieTipTen, tipMachiaj]);
    return result.rows;
  } catch (error) {
    console.error('Eroare la getMakeupTipTen:', error);
  }
};

module.exports = { getMakeupTipTen };
