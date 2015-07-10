var request = require('request').defaults({followAllRedirects: true, jar: true});
var cheerio = require('cheerio');

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

var ticketOffering;
function ticketSave(html){
	$ = cheerio.load(html);
	var change = false;
	ticketOffering = [];
	$('tbody').children('tr').children('td').children('b').children('a').each(function(i, elem){
		var numberEvents = $(this).parentsUntil('tr').children('td').children('a').length;
		if(events[$(this).text()] !== numberEvents || !events[$(this).text()]){
			events[$(this).text()] = numberEvents;
			change = true;
			ticketOffering.push($(this).text());
		}else{
			change = false;
		}
	});
	if(change) console.log(events);
	else console.log("No change this time");
}

module.exports = ticketOffering;