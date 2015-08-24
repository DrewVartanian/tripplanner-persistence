var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var swig = require('swig');
var sassMiddleware = require('node-sass-middleware'); 

var app = express();

// set up rendering with swig
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', swig.renderFile);

// log and body parse
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// frontend deps
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// sass middleware
app.use(
  sassMiddleware({
    src: __dirname + '/assets',
    dest: __dirname + '/public',
    debug: true
  })
);

// serve static files
app.use(express.static(__dirname + '/public'));

// serve routes
app.use(require('./routes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// handle any errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log({error: err});
  res.render('error', {
  	error: err
  });
});

// listen on a port
var port = 3000;
app.listen(port, function () {
	console.log('The server is listening closely on port', port);
});