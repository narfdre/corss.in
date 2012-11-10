var express   = require('express'),
    http      = require('http'),
    path      = require('path'),
    Feedr    = require('feedr').Feedr;

var app = express(),
    feedr = new Feedr();

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
});

app.get('/json/at/*', function(req, res){
  var url = cleanUrl(req.params[0], req.query);
  feedr.readFeed(url, function(err, result){
    if(err)
      res.send(err);
    else
      res.send(result);
  });
});

app.get('/xml/at/*', function(req, res){
  var url = cleanUrl(req.params[0], req.query);
  var xml = "";
  http.get(url, function(response) {
    response.on('data', function (chunk) {
      xml += chunk;
    }).on('end', function(){
      res.send(xml);
    });
  }).on('error', function(e) {
    res.send("Got error: " + e.message);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

function cleanUrl(uri, query){
  var url = uri,
      q = "";
  for(var i in query){
    q += i + '=' + query[i];
  }
  if(q !== ""){
    url += "?" + q;
  }
  return url;
}