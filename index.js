/* This code has been generated from your interaction model by skillinator.io

/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

// There are three sections, Text Strings, Skill Code, and Helper Function(s).
// You can copy and paste the contents as the code for a new Lambda function, using the alexa-skill-kit-sdk-factskill template.
// This code includes helper functions for compatibility with versions of the SDK prior to 1.0.9, which includes the dialog directives.



 // 1. Text strings =====================================================================================================
 //    Modify these strings and messages to change the behavior of your Lambda function


let speechOutput;
const welcomeOutput = "Welcome to Fix Master, what would you like me to do?";
const welcomeReprompt = "You can say something like...";

var assetId = 0;
var workOrderId = 0;
var description = '';
var notificationId = 0;

// 2. Skill Code =======================================================================================================
"use strict";
const Alexa = require('alexa-sdk');
const request = require('sync-request');
const APP_ID = 'amzn1.ask.skill.3a6f3407-0f2b-4d22-9843-71ca553ff067';  // TODO replace with your app ID (OPTIONAL).
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
        speechOutput = 'Placeholder response for AMAZON.StopIntent.';
        this.emit(':tell', speechOutput);
   },
   'SessionEndedRequest': function () {
        speechOutput = 'Session Ended!';
        assetId = 0;
        workOrderId = 0;
        notificationId = 0;
        description = '';
        this.emit(':tell', speechOutput);
   },
    'AMAZON.FallbackIntent': function () {
        speechOutput = '';

        //any intent slot variables are listed here for convenience


        //Your custom intent handling goes here
        speechOutput = "This is a place holder response for the intent named AMAZON.FallbackIntent. This intent has no slots. Anything else?";
        this.emit(":ask", speechOutput, speechOutput);
    },
    'AMAZON.NavigateHomeIntent': function () {
        speechOutput = '';

        //any intent slot variables are listed here for convenience
        

        //Your custom intent handling goes here
        speechOutput = "This is a place holder response for the intent named AMAZON.NavigateHomeIntent. This intent has no slots. Anything else?";
        this.emit(":ask", speechOutput, speechOutput);
    },
    'WorkOrderListIntent': function () {
        let count = 0;
        //any intent slot variables are listed here for convenience
        var response = request('GET', "http://fiix-whacks.us-east-1.elasticbeanstalk.com/orders");
        response = response.body.toString("utf-8");
        var jsonResponse = JSON.parse(response);
        jsonResponse.forEach(element => {
            count++
        });
        //Your custom intent handling goes here
        //reprompt = "This is a place holder response for the intent named WorkOrderListIntent. This intent has no slots. Anything else?";
        this.emit(":tell", 'You have ' + count.toString() + ' work orders.');
    },
    'WorkOrderDetailIntent': function () {
        //any intent slot variables are listed here for convenience

        workOrderId = parseInt(this.event.request.intent.slots.id.value);
        speechOutput = 'Here is the detail of work order ' + workOrderId.toString();
    
        this.emit(":tell", speechOutput);
    },
    'CreateWorkOrderIntent': function() {
        speechOutput = 'Sure, I can help you to create a work order. What is asset id?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'CreateWorkOrderWithAssetIdIntent': function() {
        assetId = parseInt(this.event.request.intent.slots.id.value);
        // speechOutput = 'I have created a work order with asset ' + assetId.toString();
        speechOutput = 'You said asset id is ' + assetId.toSring() + ' what is description?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'CreateWorkOrderNowIntent': function() {
        speechOutput = 'Work order was created. Do you want to create another work order?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AssignWorkOrderIntent': function() {
        name = this.event.request.intent.slots.name.value;
        speechOutput = 'Assignee is ' + name + ' Work order was created. Is there anything else I can help you?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'CreateWorkOrderWithDescriptionIntent': function(){
        description = this.event.request.intent.slots.description.value;
        speechOutput = 'You said description is ' + description + ' Do you want to assign the work order to someone or create a work order now?';
        this.emit(':ask', speechOutput, speechOutput)
    },
    'CreateWorkOrderIntentWithNotificationIdIntent': function() {
        notificationId = parseInt(this.event.request.intent.slots.id.value);
        // make endpoint to create a WO
        // set global var, workOrderId
        speechOutput = 'Work order was created with notification id ' + notificationId.toString() + ' do you want to assign the work order to someone?';
        this.emit(':ask', speechOutput, speechOutput);
    },
    'Unhandled': function () {
        speechOutput = "The skill didn't quite understand what you wanted.  Do you want to try something else?";
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
    };
    return canonical;
};

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