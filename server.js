// node modules
var path = require('path');
var http = require('http');

// express server and dependencies
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');

var dbTools = require('./dbTools');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
	secret: 'vinder15'
}));

app.post('/api/reportList', function (req, res){
	if ((!req.session.user || !req.session.user.facebookId) && req.param('reporter')){
		req.session.user = {
			facebookId 	: req.param('reporter').facebookId
		};
	}

	dbTools.newReporter(req.param('reporter'), function (err, results){
		if (err){
			console.log(err);
			res.sendStatus(500, 'Unknown error');
		} else {
			req.session.user.id = results.insertId;

			dbTools.reportArray(req.session.user.facebookId, req,param('contacts'), function (err, results){
				if (err){
					console.log(err);
					res.sendStatus(500, 'Unknown error');
				} else {
					res.sendStatus(200);
				}
			});
		}
	});
});


app.post('/api/reportStatus', function (req, res){
	var facebookId;
	if (req.param('reporter') && req.param('reporter').facebookId){
		facebookId = req.param('reporter').facebookId;
	} else if (req.session && req.session.user) {
		facebookId = req.session.user.facebookId;
	}

	if (!facebookId){
		// TODO: user not logged in
		res.sendStatus(400);
		return;
	}

	dbTools.tagFriend(facebookId, req.param('contact'), function (err, results){
		if (err){
			console.log(err);
			res.sendStatus(500, 'Unknown error');
		} else {
			res.sendStatus(200);
		}
	});
});

app.post('/api/test', function (req, res){
	console.log(JSON.stringify(req.param('mush')));
	res.sendStatus(200);
});


app.use(express.static(path.join(__dirname, 'public')));


var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('server listening on port ' + app.get('port'));
});