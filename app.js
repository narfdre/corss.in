var express   = require('express'),
    http      = require('http'),
    path      = require('path'),
    FeedParser = require('feedparser');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  res.render('index');
  //res.send('Welcome to corss');
});

app.get('/json/at/*', function(req, res){
  r2j(req.params[0],function(json) {
    res.send(json);
  });
});

app.get('/xml/at/*', function(req, res){
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


function r2j (uri,cb){
  var parser = new FeedParser();
  parser.parseUrl(uri,function(err, meta, articles){
      if(err) return console.error(err);
      cb(JSON.stringify(articles));
  });
}