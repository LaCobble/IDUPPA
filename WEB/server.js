// verifie si l'utilisateur est authentifié
function verifyAuth(req, res, next) {
  if (req.signedCookies.auth) {
    next();
  } else {
    res.redirect('/login');
  }
}

const express = require('express');
const mysql = require('mysql2');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const { sign } = require('crypto');
const app = express();
dotenv.config();

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/profile-user', verifyAuth, express.static(__dirname + '/profile-user'));
app.use('/admin-panel', verifyAuth, express.static(__dirname + '/admin-panel'));
app.use('/create-user', verifyAuth, express.static(__dirname + '/create-user'));
app.use('/users-table', verifyAuth, express.static(__dirname + '/users-table'));

// Connexion à la base de données principale
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_User
});

// Connexion à la base de données des logs
const logsDB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_Logs
});

// Connexion à la base de données des données anonymisées
const anonymizationdb = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_anonymization
});

// Middleware pour rediriger vers la page de login si l'utilisateur n'est pas authentifié
app.use((req, res, next) => {
    const authCookie = req.signedCookies.auth;
    if (!authCookie && req.path !== '/login' && req.path !== '/login.html') {
        return res.redirect('/login');
    }
    next();
});

// Middleware pour vérifier et rediriger en fonction du cookie
app.get('/', (req, res) => {
  const authCookie = req.signedCookies.auth;

  // Si le cookie n'est pas présent, rediriger vers la page de login
  if (!authCookie) {
    res.redirect('/login');
  }

    // Rediriger en fonction du rôle utilisateur dans le cookie
    const data_access_level = authCookie.data_access_level;
    const destination = data_access_level === 2 || data_access_level === 1 ? '/admin-panel/admin-panel.html' : '/profile-user';
    res.redirect(destination);

});

// Route pour la page de login
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM Users WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const user = results[0];
      const data_access_level = user.data_access_level;

      // Créer un cookie signé pour stocker l'authentification
      res.cookie('auth', { user_id: user.id, username: user.username, data_access_level: user.data_access_level }, { signed: true, httpOnly: true });

      // Redirection en fonction du rôle
      const destination = data_access_level === 2 || data_access_level === 1 ? '/admin-panel' : '/profile-user';
      res.redirect(destination);

      // Enregistrement du log de connexion dans Access_Logs
      const logQuery = `
        INSERT INTO Access_Logs (user_id, action, target_data, access_outcome)
        VALUES (?, 'LOGIN', ?, 'GRANTED')
      `;
      logsDB.query(logQuery, [user.id, destination], (logErr) => {
        if (logErr) console.error('Erreur lors de l\'insertion du log:', logErr);
      });
    } else {
      // Enregistrement d'une tentative de connexion échouée
      const logQuery = `
        INSERT INTO Access_Logs (user_id, action, target_data, access_outcome)
        VALUES (NULL, 'LOGIN', 'LOGIN ATTEMPT', 'DENIED')
      `;
      logsDB.query(logQuery, [], (logErr) => {
        if (logErr) console.error('Erreur lors de l\'insertion du log:', logErr);
      });
      res.send('Nom d\'utilisateur ou mot de passe incorrect.');
    }
  });
});

// Logout route
app.get('/logout', (req, res) => {
  res.clearCookie('auth');
  res.redirect('/login');
});
app.post('/logout', (req, res) => {
  res.clearCookie('auth');
  res.redirect('/login');
});

// Route pour la page de profil utilisateur
app.get('/profile-user', verifyAuth, (req, res) => {
  const authCookie = req.signedCookies.auth;

  // Vérifiez si l'utilisateur est authentifié
  if (!authCookie || !authCookie.user_id) {
      return res.redirect('/login');
  }

  // Requête pour récupérer les informations de l'utilisateur
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [authCookie.user_id], (err, results) => {
      if (err) {
          console.error('Erreur lors de la récupération des informations utilisateur:', err);
          return res.status(500).send('Erreur serveur');
      }

      // Si l'utilisateur existe, rendre la page profile-user.ejs avec ses informations
      if (results.length > 0) {
        const user = results[0];
        res.render('profile-user', { user });
      } else {
        res.send('Utilisateur non trouvé');
      }
  });
});

// Route pour la page de profil utilisateur
app.get('/admin-panel', verifyAuth, (req, res) => {
  const authCookie = req.signedCookies.auth;

  // Vérifiez si l'utilisateur est authentifié
  if (!authCookie || !authCookie.user_id) {
      return res.redirect('/login');
  }

    // Rediriger en fonction du rôle utilisateur dans le cookie
    const data_access_level = authCookie.data_access_level;
    if (data_access_level === 2 || data_access_level === 1)
    {
      return res.sendFile(__dirname + '/admin-panel/admin-panel.html');
    } else {
      res.redirect('/profile-user');
    }
});

app.use(express.json());

// Route pour créer un utilisateur
app.post("/api/users", (req, res) => {
  const { username, email, first_name, last_name, password, date_of_birth, city, country, sexe, profession } = req.body;
  
  const checkUsernameQuery = "SELECT * FROM Users WHERE username = ?";
  db.query(checkUsernameQuery, [username], (err, results) => {
    if (err) {
      console.error("Erreur lors de la vérification du username:", err);
      return res.status(500).json({ success: false, message: "Erreur serveur lors de la vérification du username." });
    }

    if (results.length > 0) {
      // Username existe déjà
      return res.status(400).json({ success: false, message: "Ce nom d'utilisateur existe déjà." });
    }

    // Insertion de l'utilisateur si le username n'existe pas
    const sql = "INSERT INTO Users (username, email, first_name, last_name, password, date_of_birth, city, country, sexe, profession) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [username, email, first_name, last_name, password, date_of_birth, city, country, sexe, profession], (err, result) => {
      if (err) {
        console.error(err);
        res.json({ success: false, message: "Erreur lors de la création de l'utilisateur" });
      } else {
        res.json({ success: true, message: "Utilisateur créé avec succès" });
        res.redirect('/admin-panel');
      }
    });
  });
});

// Route pour récupérer les utilisateurs
app.get("/api/users", (req, res) => {
  const authCookie = req.signedCookies.auth;

  if (!authCookie) {
    return res.status(401).json({ success: false, message: "Accès refusé : Authentification requise." });
  }

  if (authCookie.data_access_level === 2){
    const query = "SELECT * FROM anonymized_data where user_id = 1";
    anonymizationdb.query(query, (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
      }
      if (results.length > 0) {
        const user_anonymized = results[0];
        const user = [{
          first_name : user_anonymized.anonymized_name,
          last_name : user_anonymized.anonymized_firstname,
          email : user_anonymized.anonymized_email,
          id : user_anonymized.user_id,
          username : 'JohnD',
          city : 'SomeWhere',
          date_of_birth : '01/01/1999',
          country : 'SomeCountry',
          sexe : 'unknown',
          profession : 'Anonymized',
        }];
        res.json(user);
      } else {
        res.status(404).json({ success: false, message: "Aucune donnée trouvée" });
      }
    });
  }
  else{
    const query = "SELECT * FROM Users";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erreur lors de la récupération des utilisateurs:", err);
        return res.status(500).json({ success: false, message: "Erreur serveur" });
      }
      res.json(results);
    });
  }
});

// Route pour créer un utilisateur
app.use('/create-user', verifyAuth, (req, res, next) => {
  const authCookie = req.signedCookies.auth;
  if (authCookie.data_access_level === 2 || authCookie.data_access_level === 1) {
    res.sendFile(path.join(__dirname, 'create-user', 'create-user.html'));
  } else {
    res.redirect('/profile-user');
  }
});

// Route pour voir la table des utilisateurs
app.use('/users-table', verifyAuth, (req, res, next) => {
  const authCookie = req.signedCookies.auth;
  if (authCookie.data_access_level === 2 || authCookie.data_access_level === 1) {
    res.sendFile(path.join(__dirname, 'users-table', 'users-table.html'));
  } else {
    res.redirect('/profile-user');
  }
});

app.listen(3000, () => {
  console.log('Serveur en cours d\'exécution sur le port 3000');
});
