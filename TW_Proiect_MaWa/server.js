const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const { registerUser, authenticateUser } = require('./src/controllers/auth');
const handleRequest = require('./src/controllers/mainController');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');


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
        res.end('<h1>Toate câmpurile sunt necesare pentru înregistrare.</h1>');
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
        const loginPagePath = path.join(__dirname, '../src/view/login.html');
        fs.readFile(loginPagePath, (err, content) => {
          if (err) {
            res.statusCode = 500;
            res.end('Eroare la register Miru');
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
        res.writeHead(302, {
          'Location': '/pag_princ'
        });
        res.end();
      } else {
        res.setHeader('Content-Type', 'text/html');
        const loginPagePath = path.join(__dirname, '../src/view/login.html');
        fs.readFile(loginPagePath, (err, content) => {
          if (err) {
            res.statusCode = 500;
            res.end('Eroare la login Miru');
          } else {
            res.statusCode = 401;
            const errorMessage = `<error_message style="color: red;">${result.message}</error_message>`;
            const updatedContent = content.toString().replace('</form>', `${errorMessage}</form>`);
            res.end(updatedContent);
          }
        });
      }
    });
  }else if (reqUrl.pathname === '/reset-password' && req.method === 'POST') {
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
        res.end('A apărut o eroare la trimiterea email-ului de resetare.');
      }
    });
  }  
   else {
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
        user: "makeup@gmail.com",
        pass: "zbxpcxebhgqpalnp",
      },
    });

    const mailOptions = {
      from: 'makeup@gmail.com',
      to: email,
      subject: 'Resetare parolă',
      text: `Noua ta parolă este: ${newPassword}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Eroare la trimiterea email-ului de resetare:', error);
        reject(error);
      } else {
        console.log('Email de resetare trimis:', info.response);
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
  console.log('Serverul a pornit si ascultă pe portul 3000');
});
