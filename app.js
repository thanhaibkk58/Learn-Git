var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require("mongoose");
var express_session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");

var config = require("./utils/config");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var users = require("./controllers/users_controller");
var friends = require("./controllers/friends_controller");

var app = express();

require("./utils/passport")(passport); // pass passport for configuration

// Connect mongoose
mongoose.connect(config.url_db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on("open", function (ref) {
  console.log("Connected to mongo server...");
});
mongoose.connection.on("error", function (err) {
  console.log("Could not connect to mongo server!");
  console.log(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Passport
// các cài đặt cần thiết cho passport
app.use(express_session({
      secret: 'ilovescodetheworld',
      cookie: {maxAge: 60000},
      resave: true,
      saveUninitialized: true
    }
)); // chuối bí mật đã mã hóa coookie
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(users);
app.use(friends);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
