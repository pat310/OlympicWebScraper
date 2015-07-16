var request = require('request').defaults({followAllRedirects: true, jar: true});
var cheerio = require('cheerio');
var send = require('./email.js');
var sendText = require('./smsText.js');
var specialEvents = require('./eventList.js');

url = "https://www.cosport.com/olympics/tickets.aspx";

var events = {};

var count = 0;
setInterval(function(){
	request(url, function (err, response, html){
		if(count > 0){
			ticketSave(html);
		}
		console.log("Iteration number: ", count);
		if(err) return console.log(err);
		count++;
	});
}, 10000);

function ticketSave(html){
	try{	
		var ticketOffering = {};
		$ = cheerio.load(html);
		var change = false;
		var textNumber = [];

		$('tbody').children('tr').children('td').children('b').children('a').each(function(i, elem){
			var exists = [];
			var eventNames = $(this).parentsUntil('tr').children('td').children('a');
			var numberEvents = eventNames.length;
			if(!events[$(this).text()] || events[$(this).text()] !== numberEvents){
				events[$(this).text()] = numberEvents;
				change = true;

				var thisEvent = $(this).text().trim();
				exists = specialEvents.filter(function(value){
				    return value === thisEvent;
				});

				if(exists.length>0){
					textNumber.push(thisEvent);
				} 
				var name = $(this).text();
				ticketOffering[name] = [];
				eventNames.each(function(i, elem){
					ticketOffering[name].push("https://www.cosport.com" + $(this).attr('href'));
				});
			}
		});

		if(change && count>1){
			// console.log(ticketOffering);
			send(ticketOffering);
		}else console.log("No change this time");

		if(textNumber.length>0){
			sendText(textNumber);
		}
	}catch(error){
		events = {};
		count = 0;
		console.log("There was an error, server restarting...");
	}
}