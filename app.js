
/**
 * Module dependencies.
 */

var express   = require('express'),
    http      = require('http'),
    path      = require('path'),
    rsj       = require('rsj');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.all('/*', function(req, res, next) {
  console.log('setting headers');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function(req, res){
  res.send('Welcome to corss.io');
});

app.get('/json/*', function(req, res){
  rsj.r2j(req.params[0],function(json) {
    res.send(json);
  });
});

app.get('/xml/*', function(req, res){
  http.get(req.params[0], function(response) {
    response.on('data', function (chunk) {
      res.send(chunk);
    });
  }).on('error', function(e) {
    res.send("Got error: " + e.message);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
