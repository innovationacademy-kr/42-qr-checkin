require('dotenv').config()
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const passport = require('passport');
const FortyTwoStrategy = require('passport-42').Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const getDataUrl = require('./util/qrcodeUtil');
const { decrypt } = require('./util/cryptoUtil');
const Attend = require('./store.js');

passport.use(new FortyTwoStrategy({
  clientID: process.env.FORTYTWO_CLIENT_ID,
  clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
  callbackURL: process.env.RETURN_URL,
},
  function (accessToken, refreshToken, profile, cb) {
    console.log('accessToken', accessToken, 'refreshToken', refreshToken);
    return cb(null, profile);
  }));
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ resave: false, saveUninitialized: false, secret: '!Seoul' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', ensureLoggedIn(), async function (req, res) {
  const data = (req.user) ? req.user.username : '';
  const url = await getDataUrl(data);
  res.render('home', { user: req.user, dataurl: url });
});

app.get('/login',
  function (req, res) {
    res.render('login');
  });

app.get('/login/42',
  passport.authenticate('42'));

app.get('/login/42/return',
  passport.authenticate('42', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

app.get('/profile',
  ensureLoggedIn(),
  async function (req, res) {
    const url = await getDataUrl(req.user.username);
    res.render('profile', { user: req.user, dataurl: url });
  }
);

app.post('/register',
  async function (req, res) {
    const data = decrypt(req.body.data);
    console.log('p__', data);
    if (data) {
      const row = data.split('|');
      if (row.length < 2) {
        res.send({ success: false, message: 'Login Again!' });
        return;
      }
      const record = {
        event: process.env.EVENT_NAME || '202103os',
        username: row[1],
        created: new Date(Number(row[0]))
      }
      let result = {};
      try {
        result = await Attend.save(record);
      } catch (err) {
        result = { success: false, message: err.message };
      }
      res.end(JSON.stringify(result));
    } else {
      res.send({ success: false, message: 'Invalid Data.' });
    }
  }
);

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/reader', function (req, res) {
  res.render('reader');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
