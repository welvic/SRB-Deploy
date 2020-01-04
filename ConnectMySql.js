var http = require('http');
var mysql      = require('mysql');

var express = require('express/lib/express');
var CONSTANTS = require('./const');
//var connect = require('body-parser');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//app.use(connect.urlencode({extended:false}));

//express.multipart({defer: true})

app.get('/clientDetail', function(req, res){
	var obj = new Object();
	//obj.title = 'title';
	//obj.data = 'data';
	var records = new Array();

	// //console.log('params: ' + JSON.stringify(req.params));
	// //console.log('body: ' + JSON.stringify(req.body));
	// //console.log('query: ' + JSON.stringify(req.query));
	var keys = Object.keys(req.query);
	// //var getObj = JSON.parse(req.query);
	// //console.log( keys[0] + ": " + req.query[keys[0]]);

	var connection = mysql.createConnection({
	host     : CONSTANTS.DBCONFIG.HOST,
	database : CONSTANTS.DBCONFIG.DATABASE,
	user     : CONSTANTS.DBCONFIG.USER,
	password : CONSTANTS.DBCONFIG.PASSWORD,
	});

	connection.connect(function(err) {
	if (err) {
		console.error('Error connecting: ' + err.stack);
		return;
	}

	//console.log('Connected as id ' + connection.threadId);
	});

	connection.query('SELECT * FROM clientdetail', function (error, results, fields) {
	if (error)
		throw error;

	results.forEach(result => {
		//console.log(result);
		obj = CreateFlatObject(obj,result);
		//console.log("Final");
		//console.log(obj);
		//  console.log(typeof obj)
		records.push(obj);
		//console.log(records.length);
		obj = new Object();
		//console.log(records);

		// var keys = Object.keys(result);
		// 	keys.forEach(item=>{
		// 		//console.log(typeof result[item]);
		// 		//console.log(result[item])
		// 	});
		 });

		res.header('Content-type','application/json');
		res.header('Charset','utf8');
		//res.send(req.query.callback + '('+ JSON.stringify(records) + ');');
		res.send(JSON.stringify(records));
	});

	connection.end();
	console.log("Records");
	console.log(records);


	//obj[keys[0]] = req.query[keys[0]];
	//obj[keys[1]] = req.query[keys[1]];

	// res.header('Content-type','application/json');
	// res.header('Charset','utf8');
	// res.send(req.query.callback + '('+ JSON.stringify(records) + ');');
	//res.send(JSON.stringify(records));
});


// app.post('/endpoint1', function(req, res){
// 	//console.log('Inside');
// 	var obj = {};
// 	//console.log('body: ' + JSON.stringify(req.body));
// 	res.send(req.body);
// });


app.listen(5050);

function CreateFlatObject(finalObj, complexObject){
	console.log("TypeOf ComplexObject = " + typeof complexObject);
	if(typeof complexObject =="string"){
		complexObject = JSON.parse(complexObject);
	}
	var keys = Object.keys(complexObject);
	keys.forEach(item=>{
		if(CONSTANTS.IGNORECOLUMNS.COLUMNS.indexOf(item)>-1){
			return;
		}
		//console.log(complexObject[item]);
		//if(IsJson(String(complexObject[item]))){
		if(IsJson(item,String(complexObject[item]))){
			console.log("Inside CreateFlatObject");
			console.log("item=" + item);
			console.log("complexObject=" + complexObject[item]);

			finalObj = CreateFlatObject(finalObj,complexObject[item]);
			//return;
		}
		else{
		finalObj[item] = complexObject[item];
		console.log(JSON.stringify(finalObj));
		////console.log(typeof result[item]);
		////console.log(result[item])
		}
	});
	return finalObj;
}

function IsJson(columnName,obj){
	// var str = obj;
    // //if (str.blank()) return false;
    // str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@');
    // str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
    // str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '');
	// return (/^[\],:{}\s]*$/).test(str);
	// console.log("Inside IsJson");
	// console.log("columnName=" + columnName);

	if(CONSTANTS.JSONCOLUMNS.COLUMNS.indexOf(columnName)>-1){
	console.log("return true");
	return true;
	}
	console.log("return false");
	return false; 
	// try {
	// 	JSON.parse(obj);
	// } catch (error) {
	// 	return false;
	// }
	// return true;
}