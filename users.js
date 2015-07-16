var fs = require('fs');

//read user file and send to parsing function
var csvFile = fs.readFileSync("email.csv","utf8");
var csv_data = csvParse(csvFile);

function csvParse(csvFile){
	//split data at new lines (note there is one extra \n line at the end to remove)
	csvFile = csvFile.split("\n");
	var headers = csvFile.slice(0,1).toString().split(",");
	var userData = csvFile.slice(1,csvFile.length-1);

	//build user constructor function
	var userConstructor = function(array){
		for(var i = 0; i < headers.length; i++){
			this[headers[i]] = array[i];
		}
	};

	var users = [];
	//loop over number of users
	for(var i = 0; i < userData.length; i++){
		//split each user into separate fields
		var curUser = userData[i].toString().split(",");
		//pass fields into constructor function to construct user object for each user
		users[i] = new userConstructor(curUser);
	}
	return users;
}

module.exports = csv_data;