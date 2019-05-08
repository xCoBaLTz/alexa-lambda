const request = require('sync-request');

let count = 0;
		//any intent slot variables are listed here for convenience
        var response = request('GET', "http://fiix-whacks.us-east-1.elasticbeanstalk.com/orders");
        var jsonResponse = JSON.parse(response.body.toString());
        jsonResponse.forEach(() => count++);
        console.log(count.toString());