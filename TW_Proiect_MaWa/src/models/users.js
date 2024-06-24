const dbPool = require("../utils/dbSingleton");

const getUser = async (userId) => {

  const query = `
      SELECT last_name, first_name, email
      FROM users
      WHERE id=$1
    `;
  try {
    const result = await dbPool.query(query, [userId]);
    return result.rows;
  } catch (error) {
    console.error('Eroare la getUser:', error);
  }
};

module.exports = { getUser };
