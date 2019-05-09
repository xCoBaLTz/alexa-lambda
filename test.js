const request = require('sync-request');

let workOrderRequest = {};
const BASE_URL = 'http://fiix-whacks.us-east-1.elasticbeanstalk.com/hack-api'

workOrderRequest.asset = {};
workOrderRequest.asset.id = 100;
workOrderRequest.assignTo = "Seanan";
workOrderRequest.description = 'test';

//any intent slot variables are listed here for convenience
var res = request('POST', BASE_URL + '/work-orders', {
    json: workOrderRequest,
});
var id = JSON.parse(res.getBody('utf-8')).id;
console.log(id);