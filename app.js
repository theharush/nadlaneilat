//Requiring Node Modules ===================================
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var houses = require('./models/houses');
var favicon = require('serve-favicon');
var device = require('express-device');

//Setting up DB Connection  ===============================
mongoose.connect('mongodb://nadlaneilat:nadlan1234@ds033123.mongolab.com:33123/nadlaneilat');
//-->Connection DEBUG
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("Connected to database.");
});



//Configuring Passport ===============================
require('./config/passport')(passport); // pass passport for configuration


//Setting up Express Application  ===============================
var app = express();

//--> setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');//view engine setup
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(device.capture());
device.enableDeviceHelpers(app)


// Passport Authentication initializing and setup =============================
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


//Local Variables  ===============================
app.locals.recom = require('./recommended.json');
app.locals.homepath = path.join(__dirname, 'public');
mongoose.model('houses').find(null, null, {sort: {'_id': -1}},function(err, hou){
  app.locals.houses = hou;
});

function loadHouses (req, res, next) {
   if (req.method === 'GET') { 
      mongoose.model('houses').find(null, null, {sort: {'_id': -1}},function(err, hou){
          app.locals.houses = hou;
      });
   } next() }
   

//Requiring Express Routes  ===============================
var homepage = require('./routes/index');
var about = require('./routes/about');
var board = require('./routes/board');
var contact = require('./routes/contact');
var property = require('./routes/property');
var login = require('./routes/login');
var admin = require('./routes/admin');
admin.use(express.static(path.join(__dirname, 'public')));
admin.use(flash()); // use connect-flash for flash messages stored in session


//Routing URLs  ===============================
app.use(loadHouses)
app.use('/', homepage);
app.use('/about', about);
app.use('/board', board);
app.use('/contact', contact);
app.use('/property', property);
app.use('/login', login);
app.use('/manage', admin);


// LOGOUT ==============================
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
