var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req,res){
	fs.readFile('./public/index.html', function(error, data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);
	});
});

var port = 80;
app.listen(port);
console.log('App is running on port: ', port);
