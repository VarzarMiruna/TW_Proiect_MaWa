const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pg = require('pg');
const crypto = require('crypto');

const dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'MAWA',
    password: 'miruna',
    port: 5432
};
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
  };
  
  const secretKey = generateSecretKey();

// functie pt inregistrare
async function registerUser(userData) {
  const client = new pg.Client(dbConfig);
  await client.connect();

  try {
    // verificam daca userul este deja in bd pe baza email-ului
    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1 ',
      [userData.email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('Adresa de email este deja inregistrata.');
    }

    if (userData.password !== userData.confirm_password) {
      throw new Error('Parola si confirmarea parolei nu se potrivesc.');
    }
    // Hash parola utilizatorului
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // inseram userul in bd
    await client.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)',
      [userData.first_name, userData.last_name, userData.email, hashedPassword]
    );

    return { success: true, message: 'Utilizator inregistrat cu succes.' };
  } catch (error) {
    return { success: false, message: error.message };
  } finally {
    await client.end();
  }
}

// Functie pt autentificare
async function authenticateUser(email, password) {
  const client = new pg.Client(dbConfig);
  await client.connect();

  try {
    // caut userul in bd dupa email
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      throw new Error('Utilizatorul nu exista.');
    }

    // verific daca parola e corecta
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Parola incorecta, incearca din nou');
    }

    // generez token JWT
    const token = jwt.sign({ id: user.id }, secretKey); 

    return { success: true, message: 'Autentificare cu succes.', token };
  } catch (error) {
    return { success: false, message: error.message };
  } finally {
    await client.end();
  }
}

async function changePassword(userData) {
  const client = new pg.Client(dbConfig);
  await client.connect();

  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [userData.email])
    const user = result.rows[0];

    if (!user) {
      throw new Error('Utilizatorul nu exista.');
    }

    // verific daca parola e corecta
    const isPasswordValid = await bcrypt.compare(userData.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Parola incorecta, incearca din nou');
    }

    if (userData.new_password !== userData.confirm_new_password) {
      throw new Error('Parola si confirmarea parolei nu se potrivesc.');
    }

    const hashedPassword = await bcrypt.hash(userData.new_password, 10);

    await client.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, userData.email ]
    );

    return { success: true, message: 'Utilizator inregistrat cu succes.' };
  }
  catch (error) {
    return { success: false, message: error.message };
  }
  finally {
    await client.end();
  }
}

module.exports = { registerUser, authenticateUser, changePassword };
