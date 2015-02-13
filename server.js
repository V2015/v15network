// node modules
var path = require('path');
var http = require('http');

// express server and dependencies
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var dbTools = require('./dbTools');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/reportList', function (req, res){
	dbTools.newReporter(req.param('reporter'), function (err, results){
		if (err){
			console.log(err);
			res.send(500, 'Unknown error');
		} else {
			dbTools.reportArray(results.insertId, req,param('contacts'), function (err, results){
				if (err){
					console.log(err);
					res.send(500, 'Unknown error');
				} else {
					res.send(200);
				}
			});
		}
	});
});


app.post('/api/reportStatus', function (req, res){
	dbTools.tagFriend(req.param('reporter').imei, req.param('contact'), function (err, results){
		if (err){
			console.log(err);
			res.send(500, 'Unknown error');
		} else {
			res.send(200);
		}
	});
});

app.post('/api/test', function (req, res){
	console.log(JSON.stringify(req.params));
	res.sendStatus(200);
});


app.use(express.static(path.join(__dirname, 'public')));


var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('server listening on port ' + app.get('port'));
});