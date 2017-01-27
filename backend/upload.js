var dataArray = require('./data.js');

var querystring = require('querystring');
var http = require('http');

dataArray.forEach(function(obj){
	var data = querystring.stringify(obj);

	var options = {
	    host: '35.160.14.22',
	    port: 3000,
	    path: '/person',
	    method: 'POST',
	    headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': Buffer.byteLength(data)
	    }
	};

	var req = http.request(options, function(res) {
	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
		console.log("body: " + chunk);
	    });
	});

	req.write(data);
	req.end();
});
