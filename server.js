// Get the packages we need
var express = require('express');
var https = require('https');
var http = require('http');
var request = require('request');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var session = require('express-session');
var timeout = require('connect-timeout');
var gameService = require('./services/GameService');

var app = express();

app.set('view engine', 'ejs');

// Use the body-parser package in our application
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var router = express.Router();

router.post('/updatePlayers', function(req, res, next){
  gameService.GameService.UpdatePlayer(req.body.params.playerObject, function(err, response){
    var result = response;
    res.status(200);
    if(err){
      console.log(err);
      res.status(500);
      result = {ErrorCode: 500};
    }

    res.json(result);
 });
});

router.get('/getAllPlayers', function(req, res, next){
   console.log('hey');
   gameService.GameService.GetAllPlayers(function(err, response){
       var result = response;
       res.status(200);
       if(err){
         console.log(err);
         res.status(500);
         result = {ErrorCode: 500};
       }
   
       res.json(result);
    });
   });

app.use(timeout(120000));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}

app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

// Register all our routes with /api
app.use('/api', router);

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(sslOptions, app);

// Use environment defined port or 3000
var httpPort = process.env.PORT || 3000;
//var httpsPort = process.env.PORT || 8000;

// Start the http server
httpServer.listen(httpPort, function(err) {
    console.log(err, httpServer.address());
}); 
