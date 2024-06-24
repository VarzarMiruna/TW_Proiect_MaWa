const dbPool = require("../utils/dbSingleton");

const getMakeupPret = async (categoriePret, tipMachiaj) => {

  const query = `
      SELECT descriere
      FROM prices
      WHERE categorie = $1
      AND machiaj = $2
    `;
  try {
    const result = await dbPool.query(query, [categoriePret, tipMachiaj]);
    return result.rows;
  } catch (error) {
    console.error('Eroare la getMakeupPret:', error);
  }
};

module.exports = { getMakeupPret };
