const dbPool = require("../utils/dbSingleton");

const getMakeupOcazie = async (categorieOcazie, tipMachiaj) => {

  const query = `
      SELECT descriere
      FROM ocazie
      WHERE categorie = $1
      AND machiaj = $2
    `;
  try {
    const result = await dbPool.query(query, [categorieOcazie, tipMachiaj]);
    return result.rows;
  } catch (error) {
    console.error('Eroare la getMakeupOcazie:', error);
  }
};

module.exports = { getMakeupOcazie };
