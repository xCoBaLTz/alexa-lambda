let speechOutput;

const welcomeOutput = "Welcome to Fix Software, what would you like me to do?";
const welcomeReprompt = "You can say something like...";

let workOrderId = 0;
let name = '';
let description = '';
let assetId = 0;
let notificationId = 0;
let workOrderRequest = {};

// 2. Skill Code =======================================================================================================
"use strict";
const Alexa = require('alexa-sdk');
const request = require('sync-request');
const APP_ID = 'amzn1.ask.skill.3a6f3407-0f2b-4d22-9843-71ca553ff067';  // TODO replace with your app ID (OPTIONAL).
const BASE_URL = 'http://fiix-whacks.us-east-1.elasticbeanstalk.com/hack-api'
speechOutput = '';
const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', welcomeOutput, welcomeReprompt);
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = 'Placeholder response for AMAZON.HelpIntent.';
        this.emit(':ask', speechOutput, speechOutput);
    },
   'AMAZON.CancelIntent': function () {
        speechOutput = 'Placeholder response for AMAZON.CancelIntent';
        this.emit(':tell', speechOutput);
    },
   'AMAZON.StopIntent': function () {
        speechOutput = 'Thank you for listening to the demo, we hope you enjoyed, WHACKS out!';
        this.emit(':tell', speechOutput);
   },
   'SessionEndedRequest': function () {
        speechOutput = 'Session Ended!';
        workOrderId = 0;
        notificationId = 0;
        assetId = 0;
        description = '';
        name = '';
        this.emit(':tell', speechOutput);
   },
    'AMAZON.FallbackIntent': function () {
        //Your custom intent handling goes here
        speechOutput = "Sorry I didn't get that, is there anything else I can help you with?";
        this.emit(":ask", speechOutput, speechOutput);
    },
    'AMAZON.NavigateHomeIntent': function () {
        //Your custom intent handling goes here
        speechOutput = "This is a place holder response for the intent named AMAZON.NavigateHomeIntent. This intent has no slots. Anything else?";
        this.emit(":ask", speechOutput, speechOutput);
    },
    'WorkOrderCountIntent': function () {
        var response = request('GET', BASE_URL + "/work-orders");
        var jsonResponse = JSON.parse(response.body.toString());
        this.emit(":ask", 'You have ' + jsonResponse.length.toString() + ' work orders.');
    },
    'WorkOrderDetailIntent': function () {
        workOrderId = parseInt(this.event.request.intent.slots.id.value);
        var url = BASE_URL + "/work-orders/" + workOrderId.toString();
        var response = request('GET', url);
        var jsonResponse = JSON.parse(response.body.toString());
        speechOutput = 'Here is the detail of work order ' + workOrderId.toString() + '. ' + jsonResponse.notes.toString() + '.';
        this.emit(":ask", speechOutput);
    },
    'CreateWorkOrderIntent': function() {
        workOrderId = 0;
        notificationId = 0;
        assetId = 0;
        description = '';
        name = '';
        workOrderRequest = {};
        speechOutput = 'Sure, I can help you to create a work order. Which asset would you like to create this work order for?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'CreateWorkOrderWithAssetIdIntent': function() {
        assetId = parseInt(this.event.request.intent.slots.id.value);
        workOrderRequest.asset = {};
        workOrderRequest.asset.id = assetId;
        speechOutput = 'Asset ' + assetId.toString() + ' has been added to the work order, what would you like the description to be for the work order?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'CreateWorkOrderNowIntent': function() {
        var res = request('POST', BASE_URL + '/work-orders', {
            json: workOrderRequest,
        });
        var id = JSON.parse(res.getBody('utf-8')).id;
        speechOutput = 'Work order ' + id.toString() + ' was created. Do you want to create another work order?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AssignWorkOrderIntent': function() {
        name = this.event.request.intent.slots.name.value;
        workOrderRequest.assignTo = name;
        var res = request('POST', BASE_URL + '/work-orders', {
            json: workOrderRequest,
        });
        workOrderId = JSON.parse(res.getBody('utf-8')).id;
        speechOutput = 'Work order ' + workOrderId.toString() + ' was created and assigned to ' + name + '. Is there anything else I can help you with?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'IWantToAssignIntent': function(){
        speechOutput = 'Okay, who would you like to assign the work order to?';
        this.emit(':ask', speechOutput, speechOutput)
    },
    'CreateWorkOrderWithDescriptionIntent': function(){
        description = this.event.request.intent.slots.description.value;
        workOrderRequest.description = description;
        speechOutput = 'The description was added, do you want to assign the work order to someone or create the work order as is?';
        this.emit(':ask', speechOutput, speechOutput)
    },
    'CreateWorkOrderWithNotificationIdIntent': function() {
        notificationId = parseInt(this.event.request.intent.slots.id.value);
        var res = request('POST', BASE_URL + '/notifications/' + notificationId.toString() + '/work-orders', {
            json: {},
        });
        workOrderId = JSON.parse(res.getBody('utf-8')).id;

        speechOutput = 'Work order ' + workOrderId.toString() + ' was created with notification id ' + notificationId.toString() + '. Is there anything else I can help you with?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'CreateWorkOrderWithNotificationIdAssignedIntent': function() {
        notificationId = parseInt(this.event.request.intent.slots.id.value);
        name = this.event.request.intent.slots.name.value;
        workOrderRequest.assignTo = name;

        var res = request('POST', BASE_URL + '/notifications/' + notificationId.toString() + '/work-orders', {
            json: workOrderRequest,
        });
        workOrderId = JSON.parse(res.getBody('utf-8')).id;

        speechOutput = 'Work order ' + workOrderId.toString() + ' was created with notification id ' + notificationId.toString() + ' and assigned to ' + name + '. Is there anything else I can help you with?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AssetMeterReadingRequestIntent': function() {
        let assetId = parseInt(this.event.request.intent.slots.id.value);
        var url = BASE_URL + "/assets/" + assetId.toString();
        var response = request('GET', url);
        var celsius = JSON.parse(response.body.toString()).assetReadings[0].celsius;
        var fahrenheit = JSON.parse(response.body.toString()).assetReadings[0].fahrenheit;
        speechOutput = 'The temperature of asset ' + assetId.toString() + ' is ' + celsius.toString() + ' degrees celsius, or ' + fahrenheit.toString() + ' degrees fahrenheit.';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'Unhandled': function () {
        speechOutput = "It seems there isn't a handler for that request, please contact Fix Software support for more information.  Do you want to try something else in the mean time?";
        this.emit(':ask', speechOutput, speechOutput);
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function resolveCanonical(slot){
    //this function looks at the entity resolution part of request and returns the slot value if a synonyms is provided
    let canonical;
    try{
        canonical = slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    }catch(err){
        console.log(err.message);
        canonical = slot.value;
    }
    return canonical;
}

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      let updatedIntent= null;
      // updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      //this.emit(":delegate", updatedIntent); //uncomment this is using ASK SDK 1.0.9 or newer
      
      //this code is necessary if using ASK SDK versions prior to 1.0.9 
      if(this.isOverridden()) {
            return;
        }
        this.handler.response = buildSpeechletResponse({
            sessionAttributes: this.attributes,
            directives: getDialogDirectives('Dialog.Delegate', updatedIntent, null),
            shouldEndSession: false
        });
        this.emit(':responseReady', updatedIntent);
        
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      //this.emit(":delegate"); //uncomment this is using ASK SDK 1.0.9 or newer
      
      //this code necessary is using ASK SDK versions prior to 1.0.9
        if(this.isOverridden()) {
            return;
        }
        this.handler.response = buildSpeechletResponse({
            sessionAttributes: this.attributes,
            directives: getDialogDirectives('Dialog.Delegate', null, null),
            shouldEndSession: false
        });
        this.emit(':responseReady');
        
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}


function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
function isSlotValid(request, slotName){
        let slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        let slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}

//These functions are here to allow dialog directives to work with SDK versions prior to 1.0.9
//will be removed once Lambda templates are updated with the latest SDK

function createSpeechObject(optionsParam) {
    if (optionsParam && optionsParam.type === 'SSML') {
        return {
            type: optionsParam.type,
            ssml: optionsParam['speech']
        };
    } else {
        return {
            type: optionsParam.type || 'PlainText',
            text: optionsParam['speech'] || optionsParam
        };
    }
}

function buildSpeechletResponse(options) {
    let alexaResponse = {
        shouldEndSession: options.shouldEndSession
    };

    if (options.output) {
        alexaResponse.outputSpeech = createSpeechObject(options.output);
    }

    if (options.reprompt) {
        alexaResponse.reprompt = {
            outputSpeech: createSpeechObject(options.reprompt)
        };
    }

    if (options.directives) {
        alexaResponse.directives = options.directives;
    }

    if (options.cardTitle && options.cardContent) {
        alexaResponse.card = {
            type: 'Simple',
            title: options.cardTitle,
            content: options.cardContent
        };

        if(options.cardImage && (options.cardImage.smallImageUrl || options.cardImage.largeImageUrl)) {
            alexaResponse.card.type = 'Standard';
            alexaResponse.card['image'] = {};

            delete alexaResponse.card.content;
            alexaResponse.card.text = options.cardContent;

            if(options.cardImage.smallImageUrl) {
                alexaResponse.card.image['smallImageUrl'] = options.cardImage.smallImageUrl;
            }

            if(options.cardImage.largeImageUrl) {
                alexaResponse.card.image['largeImageUrl'] = options.cardImage.largeImageUrl;
            }
        }
    } else if (options.cardType === 'LinkAccount') {
        alexaResponse.card = {
            type: 'LinkAccount'
        };
    } else if (options.cardType === 'AskForPermissionsConsent') {
        alexaResponse.card = {
            type: 'AskForPermissionsConsent',
            permissions: options.permissions
        };
    }

    let returnResult = {
        version: '1.0',
        response: alexaResponse
    };

    if (options.sessionAttributes) {
        returnResult.sessionAttributes = options.sessionAttributes;
    }
    return returnResult;
}

function getDialogDirectives(dialogType, updatedIntent, slotName) {
    let directive = {
        type: dialogType
    };

    if (dialogType === 'Dialog.ElicitSlot') {
        directive.slotToElicit = slotName;
    } else if (dialogType === 'Dialog.ConfirmSlot') {
        directive.slotToConfirm = slotName;
    }

    if (updatedIntent) {
        directive.updatedIntent = updatedIntent;
    }
    return [directive];
}