const request = require('sync-request');

let workOrderRequest = {};

let count = 0;
//any intent slot variables are listed here for convenience
var response = request('GET', "http://fiix-whacks.us-east-1.elasticbeanstalk.com/orders");
var jsonResponse = JSON.parse(response.body.toString());
console.log(jsonResponse.length);

workOrderRequest.id = 1;
workOrderRequest.name = 'Seanan';
workOrderRequest.description = 'test';

console.log(workOrderRequest);