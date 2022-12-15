var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var devicesRouter = require('./routes/devices');
var measurementsRouter = require('./routes/measurements');
const log = require('./middleware/log');
const isAuthorized = require('./middleware/isAuthorized');
const { default: mongoose } = require('mongoose');

require('dotenv').config();
mongoose.connect(process.env.MONGODB_URL, {})
  .then(() => { console.log('MongoDB connected') })
  .catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running.");
    console.log(err)
  });

var app = express();

// enable all origins on all routes
app.use(cors());
app.options('*', cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/devices', log, devicesRouter);
app.use('/devices', log, isAuthorized, devicesRouter);
app.use('/measurements', log, isAuthorized, measurementsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
