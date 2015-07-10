var request = require('request');
var cheerio = require('cheerio');
 
// set some defaults
req = request.defaults({
	jar: true,                 // save cookies to jar
	rejectUnauthorized: false, 
	followAllRedirects: true   // allow redirections
});
 
// scrape the page
req.get({
    url: "https://www.cosport.com/olympics/tickets.aspx",
/*    headers: {
        'User-Agent': 'Super Cool Browser' // optional headers
     }*/
  }, function(err, resp, body) {
	
	// load the html into cheerio
	var $ = cheerio.load(body);
	
	// get the data and output to console
	console.log( 'IP: ' + $('.inner_cntent:nth-child(1) span').text() );
	console.log( 'Host: ' + $('.inner_cntent:nth-child(2) span').text() );
	console.log( 'UA: ' + $('.browser span').text() );
	
});