const request = require('sync-request');

let count = 0;
		//any intent slot variables are listed here for convenience
        var response = request('GET', "http://fiix-whacks.us-east-1.elasticbeanstalk.com/orders");
        response = response.body.toString("utf-8");
        var jsonResponse = JSON.parse(response);
        jsonResponse.forEach(element => {
            count++
        });
        console.log(count.toString());