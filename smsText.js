var apiKeys = require('./api.js');
var accountSid = apiKeys.accountSid;
var authToken = apiKeys.authToken;
var twilioNumber = apiKeys.twilioNumber;

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

var users = require('./users.js');

var sendText = function(body){
	body = "Events added: " + body.join();
	for(var i = 0; i < users.length; i++){
		if(users[i].number) sendSMS(users[i].number, body);
	}

	function sendSMS(to_number, body){
		client.messages.create({ 
			to: to_number, 
			from: twilioNumber, 
			body: body,   
		}, function(err, message) { 
			if(err) return console.log(err);
			console.log(message.sid); 
		});
	console.log("Text sent to: ", to_number);
	}
};

// sendText("this is the body")
module.exports = sendText;