var fs = require('fs');
var ejs = require('ejs');

var mailgunApiKey = require('./api.js').mailgunApiKey;
var emailAdd = require('./api.js').emailAdd;
var rp = require('request-promise');

var csv_data = require('./users.js');

var send = function (ticketOffering){

	//read in ejs email template and send to ejsTemplate function for replacing
	var template = fs.readFileSync('email_template.ejs','utf-8');
	var emailTemplate = ejsTemplate(template,csv_data);

	//sending emails
	for(var i = 0; i<csv_data.length; i++){
		var to_name = csv_data[i].firstName + " " + csv_data[i].lastName;
		var to_email = csv_data[i].emailAddress;
		var from_email = emailAdd;
		var subject = "olympic ticket offerings have changed";
		var message_html = emailTemplate[i];
		console.log("Message sent to ", to_name);
		sendEmail(to_name, to_email, from_email, subject, message_html);
	}

	function sendEmail(to_name, to_email, from_email, subject, message_html){
		var options = {
			method: 'POST',
			uri: 'https://api.mailgun.net/v3/trasb.org/messages',
			headers: {
				Authorization: 'Basic YXBpOmtleS1iODgzOTMxOGU0ZjJlMGExM2RjZjhkYjM3ZDQwYzY3NQ==',
				api: mailgunApiKey
			},
			form: {
				from: from_email,
				to: to_name + '<' + to_email + '>',
				subject: subject,
				html: message_html
			}
		};

		rp(options)
		.then(function(){
			console.log('email sent!');
		})
		.catch(function(err){
			console.log('there was an err', err);
		});
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

module.exports = send;