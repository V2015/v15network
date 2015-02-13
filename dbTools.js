var mysql = require('mysql');

if (process.argv.length > 2 && process.argv[2] === '-create'){
	createTables();
}

function createTables(){
	var createQueries = [{
		query 		: 'CREATE TABLE reporters (' +
						'rep_id INT NOT NULL AUTO_INCREMENT, ' +
						'rep_name VARCHAR(100), ' + 
						'rep_phone VARCHAR(10), ' + 
						'rep_facebook VARCHAR(32), ' + 
						'rep_imei VARCHAR(15), ' + 
						'PRIMARY KEY (rep_id), ' +
						'UNIQUE KEY (rep_imei)' +
					');',
		callback 	: 	function (err, results){
			if (err){
				// do something
				console.log(err);
			} else {
				console.log('success');
			}
		}
	}, {
		query  		: 'CREATE TABLE contacts (' +
						'rep_id INT NOT NULL, ' +
						'con_name VARCHAR(100), ' + 
						'con_phone VARCHAR(10), ' + 
						'con_facebook VARCHAR(32),' +
						'con_status INT' +
					');',
		callback 	: function (err, results){
			if (err){
				// do something
				console.log(err);
			} else {
				console.log('success');
			}
		}
	}];

	query(createQueries);
}

function query (queryStr, callback){
	var conn = mysql.createConnection({
		port 		: 3306,
		user 		: 'v15network',
		password 	: 'v15v15net',
		database 	: 'v15network'
	});

	if (typeof(queryStr) === 'string'){
		conn.query(queryStr, callback);

		conn.end();
	} else {
		for (singleQuery in queryStr){
			var queryObj = queryStr[singleQuery];
			conn.query(queryObj.query, queryObj.callback);
		}

		conn.end(callback);
	}
};

function getSqlString(str) {
	return '\'' + str + '\'';
}

function newReporter(reporter, callback){
	query('INSERT INTO reporters (rep_name, rep_phone, rep_facebook, rep_imei) VALUES (' + getSqlString(reporter.name) + ', ' + getSqlString(reporter.phone) + ', ' + getSqlString(reporter.facebook) + ', ' + getSqlString(reporter.imei) + ')', callback);
}

function reportArray(reporterId, contacts, callback){
	var querys = [];

	for (var i in contacts){
		querys.push({
			query : 'INSERT INTO contacts (rep_id, con_name, con_phone, con_facebook) VALUES (' + reporterId +', ' + getSqlString(contacts[i].name) + ', ' + getSqlString(contacts[i].phone) + ', ' + getSqlString(contacts[i].facebook) + ')'
		});
	}

	query(querys, callback);
}

// function tagFriend(reporterId, contact, callback){
// 	query('UPDATE contacts SET con_status = ' + contact.status + ' WHERE rep_id = ' + reporterId + ' AND con_name = ' + contact.name + ' AND con_phone = ' + contact.phone + ' AND con_facebook = ' + contact.facebook, callback);
// }

function tagFriend(reporterImei, contact, callback){
	query('UPDATE contacts SET con_status = ' + contact.status + ' WHERE con_name = ' + contact.name + ' AND con_phone = ' + contact.phone + ' AND con_facebook = ' + contact.facebook + ' AND rep_id IN (SELECT rep_id FROM reporters WHERE rep_imei = ' + reporterImei + ')', callback);
}

// function getUserIdByIMEI(imei, callback){
// 	query('SELECT rep_id AS "reporterId" FROM reporters WHERE rep_imei = ' + imei, callback);
// }

module.exports = {
	newReporter 	: newReporter,
	reportArray 	: reportArray,
	tagFriend 		: tagFriend
};