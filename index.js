const path = require('path');

const express = require('express');
const passport = require('passport');
const Strategy = require('passport-google-oauth20').Strategy;
const config = require('./config.json');

const database = require('./database');

// Configure Passport
passport.use(new Strategy({
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  callbackURL: '/login/google/return'
}, (accessToken, refreshToken, profile, cb) => {
  //
  // DO STUFF WITH DATABASE HERE?
  //
  return cb(null, profile);
}));



passport.serializeUser((user, cb) => { cb(null, user); });
passport.deserializeUser((obj, cb) => { cb(null, obj); });

// Configure Application
const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({
  secret: config.EXPRESS_SECRET,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    res.sendFile(path.join(__dirname, '/website/index.html'));
  }
);

app.get('/bootstrap.css',
  (req, res) => {
    res.sendFile(path.join(__dirname, '/website/bootstrap.css'));
  }
);

app.get('/build.js',
  (req, res) => {
    res.sendFile(path.join(__dirname, '/website/build.js'));
  }
);

app.get('/login',
  (req, res) => {
    res.sendFile(path.join(__dirname, '/website/login.html'));
  }
);

app.get('/login/google',
  passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'})
);

app.get('/login/google/return',
  passport.authenticate('google', {failureRedirect: '/login'}),
  (req, res) => {
    res.redirect('/');
  }
);

app.get('/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
  }
);

// The cool REST stuff
app.get('/api/profile',
  (req, res) => {
    if (req.user) {
      database.getUserProfile(req.user.id, (err, profile) => {
        if (err) {
          res.status(500).set('Uh oh... Something went wrong!');
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({
            account: req.user,
            profile: profile
          }, null, 2));
        }
      });
    } else {
      res.status(401).send('Unauthorized: Please log in.');
    }
  }
);

app.post('/api/updateProfile',
  (req, res) => {
    if (req.user) {
      database.updateUserProfile(req.user.id, req.body.updatedExaminees, (err) => {
        if (err) {
          res.status(500).set('Uh oh... Something went wrong!');
        } else {
          res.send('Success');
        }
      });
    } else {
      res.status(401).send('Unauthorized: Please log in.');
    }
  }
);

// Catch-all for ReactRouter
app.get('*',
  require('connect-ensure-login').ensureLoggedIn('/login'),
  (req, res) => {
    res.sendFile(path.join(__dirname, '/website/index.html'));
  }
);

let port = process.argv[2] || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
