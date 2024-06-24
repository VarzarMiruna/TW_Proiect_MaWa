const dbPool = require("../utils/dbSingleton");

const getMakeupVarsta = async (categorieVarsta, tipMachiaj) => {

  const query = `
      SELECT descriere
      FROM makeup_varsta
      WHERE categorie = $1
      AND machiaj = $2
    `;
  try {
    const result = await dbPool.query(query, [categorieVarsta, tipMachiaj]);
    return result.rows;
  } catch (error) {
    console.error('Eroare la getMakeupVarsta:', error);
  }
};

module.exports = { getMakeupVarsta };
