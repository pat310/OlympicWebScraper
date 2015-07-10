var request = require('request').defaults({followAllRedirects: true, jar: true});
var cheerio = require('cheerio');
var send = require('./email.js');

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

var ticketOffering = {};
function ticketSave(html){
	$ = cheerio.load(html);
	var change = false;
	ticketOffering = [];
	$('tbody').children('tr').children('td').children('b').children('a').each(function(i, elem){
		var eventNames = $(this).parentsUntil('tr').children('td').children('a');
		var numberEvents = eventNames.length;
		if(events[$(this).text()] !== numberEvents || !events[$(this).text()]){
			events[$(this).text()] = numberEvents;
			change = true;
			var name = $(this).text();
			ticketOffering[name] = [];
			eventNames.each(function(i, elem){
				ticketOffering[name].push("https://www.cosport.com" + $(this).attr('href'));
			});
		}
	});
	if(change){
		// console.log(ticketOffering);
		send(ticketOffering);
	}else console.log("No change this time");
}

// module.exports = ticketOffering;