const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const querystring = require('querystring');
const { registerUser, authenticateUser, changePassword } = require('./src/controllers/auth');
const handleRequest = require('./src/controllers/mainController');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { setSession, getUserById } = require('./src/controllers/contController');

const dbConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'MAWA',
  password: 'miruna',
  port: 5432
};

const pool = new Pool(dbConfig);

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === '/register' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const userData = querystring.parse(body);

      if (!userData.email || !userData.password || !userData.confirm_password) {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400;
        res.end('<h1>Toate campurile trebuie completate.</h1>');
        return;
      }

      if (userData.password !== userData.confirm_password) {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400;
        res.end('<h1>Parola si confirmarea parolei nu se potrivesc.</h1>');
        return;
      }
      const result = await registerUser(userData);

      if (result.success) {
        res.writeHead(302, {
          'Location': '/login'
        });
        res.end();
      } else {
        res.setHeader('Content-Type', 'text/html');
        const loginPagePath = path.join(__dirname, './src/view/login.html');
        fs.readFile(loginPagePath, (err, content) => {
          if (err) {
            res.statusCode = 500;
            res.end('Eroare');
          } else {
            res.statusCode = 401;
            const errorMessage = `<h1>${result.message}</h1>`;
            const updatedContent = content.toString().replace('</form>', `${errorMessage}</form>`);
            res.end(updatedContent);
          }
        });
      }
    });
  } else if (reqUrl.pathname === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const userData = querystring.parse(body);
      const result = await authenticateUser(userData.email, userData.password);

      if (result.success) {
        const token = result.token;
        const userId = jwt.decode(token).id;
        setSession(res, userId, token);
        res.writeHead(302, {
          'Location': '/pag_princ'
        });
        res.end();
      } else {
        res.setHeader('Content-Type', 'text/html');
        const loginPagePath = path.join(__dirname, './src/view/login.html');
        fs.readFile(loginPagePath, (err, content) => {
          if (err) {
            console.log(err);
            res.statusCode = 500;
            res.end('Eroare la login');
          } else {
            res.statusCode = 401;
            const errorMessage = `<error_message style="color: red;">${result.message}</error_message>`;
            const updatedContent = content.toString().replace('</form>', `${errorMessage}</form>`);
            res.end(updatedContent);
          }
        });
      }
    });
  } else if (reqUrl.pathname === '/reset-password' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const userData = querystring.parse(body);
      const newPassword = generateNewPassword();

      try {
        await sendResetEmail(userData.email, newPassword);
        await saveNewPassword(userData.email, newPassword);

        res.writeHead(302, {
          'Location': '/login'
        });
        res.end();
      } catch (error) {
        res.writeHead(500, {
          'Content-Type': 'text/html'
        });
        res.end('A aparut o eroare la trimiterea email-ului de resetare.');
      }
    });
  } else if (reqUrl.pathname === '/cont' && req.method === 'GET') {
    const token = req.headers.cookie.split(';')[1].split('=')[1];
    const userId = jwt.decode(token).id;
    async function getUser() {
      const result = await getUserById(userId);
      return result;
    }
    getUser();
  } else if (reqUrl.pathname === '/change' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const userData = querystring.parse(body);
      if (!userData.email || !userData.password || !userData.new_password || !userData.confirm_new_password) {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400;
        res.end('<h1>Toate campurile trebuie completate.</h1>');
        return;
      }

      if (userData.new_password !== userData.confirm_new_password) {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400;
        res.end('<h1>Parola si confirmarea parolei nu se potrivesc.</h1>');
        return;
      }
      const result = await changePassword(userData);

      if (result.success) {
        res.writeHead(302, {
          'Location': '/login'
        });
        res.end();
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400;
        res.end('<h1>A aparut o eroare la schimbarea parolei.</h1>');
        return;
      }
    })
  } else if (reqUrl.pathname === '/feedback' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const userData = querystring.parse(body);
      if (!userData.user || !userData.mesaj || !userData.subiect) {
        res.setHeader('Content-Type', 'text/html');
        res.statusCode = 400;
        res.end('<h1>Toate campurile trebuie completate.</h1>');
        return;
      }

      const token = req.headers.cookie.split(';')[1].split('=')[1];
      const userId = jwt.decode(token).id;
      async function getUser() {
        const result = await getUserById(userId);
        return result[0];
      }
      const user = await getUser();
      try {
        await sendFeedback(user, userData);

        res.writeHead(302, {
          'Location': '/contact'
        });
        res.end();
      } catch (error) {
        res.writeHead(500, {
          'Content-Type': 'text/html'
        });
        console.log(error);
        res.end('A aparut o eroare la trimiterea email-ului de feedback.');
      }
    })
  } else {
    handleRequest(req, res);
  }
});

function generateNewPassword() {
  const length = 10; // Lungimea noii parole
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let newPassword = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    newPassword += characters.charAt(randomIndex);
  }

  return newPassword;
}

function sendResetEmail(email, newPassword) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mawa.makeup2024@gmail.com",
        pass: "jzgd xpvm olmm kang",
      },
    });

    const mailOptions = {
      from: 'mawa.makeup2024@gmail.com',
      to: email,
      subject: 'Resetare parolă',
      text: `Noua ta parolă este: ${newPassword}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Eroare la trimiterea email-ului de resetare:', error);
        reject(error);
      } else {
        console.log('Email de resetare trimis.');
        resolve();
      }
    });
  });
}

function sendFeedback(user, userData) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mawa.makeup2024@gmail.com",
        pass: "jzgd xpvm olmm kang",
      },
    });

    const mailOptions = {
      from: 'mawa.makeup2024@gmail.com',
      to: 'mawa.makeup2024@gmail.com',
      subject: userData.subiect,
      text: `De la - ${userData.user} - ${user.last_name} ${user.first_name} (${user.email}):\nMesaj: ${userData.mesaj}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Eroare la trimiterea email-ului de feedback:', error);
        reject(error);
      } else {
        console.log('Email de feedback trimis.');
        resolve();
      }
    });
  });
}
async function saveNewPassword(email, password) {
  try {
    const client = await pool.connect();
    const query = 'UPDATE users SET password = $1 WHERE email = $2';
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [hashedPassword, email];
    await client.query(query, values);

    client.release();
    console.log('Noua parolă a fost salvată în baza de date.');
  } catch (error) {
    console.error('Eroare la salvarea noii parole în baza de date:', error);
  }
}
server.listen(3000, () => {
  console.log('Serverul a pornit și ascultă pe portul 3000');
});
