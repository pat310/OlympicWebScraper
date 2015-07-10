// var ticketOffering = require('/server.js');
// ticketOffering = ["basketball", "football", "baseball"];
//require node JS filesystem API
var fs = require('fs');
//require ejs NPM
var ejs = require('ejs');


var send = function (ticketOffering){
	//read user file and send to parsing function
	var csvFile = fs.readFileSync("email.csv","utf8");
	var csv_data = csvParse(csvFile);


	//using mandrill email api
	//makes mandrill javascript api available
	var mandrill = require('mandrill-api/mandrill');
	//instantiates mandrill api and makes its functions available
	var mandrill_client = new mandrill.Mandrill('f1WTLIyGtATaHkfg9C36CQ');
	//read in ejs email template and send to ejsTemplate function for replacing
	var template = fs.readFileSync('email_template.ejs','utf-8');
	var emailTemplate = ejsTemplate(template,csv_data);

	//sending emails
	for(var i = 0; i<csv_data.length; i++){
		var to_name = csv_data[i].firstName + " " + csv_data[i].lastName;
		var to_email = csv_data[i].emailAddress;
		var from_name = "Patrick Trasborg";
		var from_email = "patrick.trasborg@gmail.com";
		var subject = "olympic ticket offerings have changed";
		var message_html = emailTemplate[i];
		console.log("Message sent to ", to_name);
		sendEmail(to_name, to_email, from_name, from_email, subject, message_html);
	}

	function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
	    var message = {
	        "html": message_html,
	        "subject": subject,
	        "from_email": from_email,
	        "from_name": from_name,
	        "to": [{
	                "email": to_email,
	                "name": to_name
	            }],
	        "important": false,
	        "track_opens": true,    
	        "auto_html": false,
	        "preserve_recipients": true,
	        "merge": false,
	        "tags": [
	            "Fullstack_Tumblrmailer_Workshop"
	        ]    
	    };
	    var async = false;
	    var ip_pool = "Main Pool";
	    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
	        // console.log(message);
	        // console.log(result);   
	    }, function(e) {
	        // Mandrill returns the error as an object with name and message keys
	        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
	    });
	}


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

	function ejsTemplate(template,users){
		var emailTemplate = [];
		//send ejs.render() method email template and user object containing first name and number of months since last contact
		//also send latest post href and title
		//do for each user 
		var eventNames = [];
		var eventLinks = [];
		var eventDate = [];
		var counter = 0;
		for(var key in ticketOffering){
			eventNames.push(key);
			eventLinks.push(ticketOffering[key]);
			eventDate.push([]);
			for(var i = 0; i<ticketOffering[key].length; i++){
				var stringPos = ticketOffering[key][i].search(/EventDate=/);
				eventDate[counter].push(ticketOffering[key][i].slice(stringPos+10));
			}
			counter++;
		}
		for(var i = 0; i<users.length; i++){
			emailTemplate[i] = ejs.render(template, {
			    firstName: users[i].firstName,
			    eventNames: eventNames,
			    eventLinks: eventLinks,
			    eventDate: eventDate
			    });
		}
		return emailTemplate;

	}
};

// send();

module.exports = send;