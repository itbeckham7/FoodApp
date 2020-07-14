const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const createError = require('http-errors');
const routes = require('../routes');
const passport = require('./passport');
const config = require('../config/index');

// App Setup
const app = express();

// Logger
if (config.morgan.enabled) {
  app.use(morgan(config.morgan.format, config.morgan.options));
}

// Compression
if (config.compression.enabled) {
  app.use(compression(config.compression.options));
}

// Secure app by setting various HTTP headers
if (config.helmet.enabled) {
  app.use(helmet(config.helmet.options));
}

// Cross-Origin-Resource-Sharing
if (config.cors.enabled) {
  app.use(cors(config.cors.options));
}

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Support parsing of */* type post data
app.use(bodyParser.json({ type: '*/*' }));

app.use(passport.initialize());

app.use(cookieParser());

app.use(fileUpload());

app.use(session({
  secret: "OzhclfxGp956SMjtq",
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 5},///This is expire time is 5days
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());


app.use(routes);

// app.use('/public', express.static(path.resolve(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public')));

// catch 404 errors and forward to error handler by default
app.use((req, res, next) => {
  res.format({
    'application/json': () => next(createError(404, 'Not Found')),
    'text/html': () => {
      res.sendFile(path.resolve(__dirname, '../public/404.html'));
    },
    default: () => next(createError(404, 'Not Found')),
  });
});

// error handler
// print stacktrace during development
// and send stacktrace to client
if (config.env === 'development') {
  app.use((err, req, res, next) => {
    console.log(err.stack);
    res
      .status(err.status || 400)
      .json({ error: { message: err.message, details: err.stack } });
  });
}

// error handler
// no stracktrace sent to client
app.use((err, req, res, next) => {
  res.status(err.status || 400).json({ error: { message: err.message } });
});

module.exports = app;
