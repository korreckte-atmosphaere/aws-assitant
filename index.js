/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Hello World to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var awsCaller = require('./awsCaller');

/**
 * HelloWorld is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HelloWorld = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HelloWorld.prototype = Object.create(AlexaSkill.prototype);
HelloWorld.prototype.constructor = HelloWorld;

HelloWorld.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

HelloWorld.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa AWS Assistant, what do you need?";
    var repromptText = "You can status check your services";
    response.ask(speechOutput, repromptText);
};

HelloWorld.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

HelloWorld.prototype.intentHandlers = {
    // register custom intent handlers
    "GetStatus": function (intent, session, response) {
        var service = intent.slots['Service'].value;

        awsCaller.CheckServiceStatus(service, function(data) {
          console.log("finished in callback");
          console.log("DATA", data);

          if (data &&
              data.Reservations[0] &&
              data.Reservations[0].Instances &&
              data.Reservations[0].Instances[0]) {
            reply = data.Reservations[0].Instances[0].InstanceId;

            response.tell(reply);
          } else {
            response.tell("You're EC2 instance is not healthy. Please do something about it.");
          }
      });
    },
    "GetBilling": function (intent, session, response) {
      awsCaller.CheckBillingStatus(function(data) {
        console.log(data);
      });
    },
    "CreateInstance": function (intent, session, response) {
      handleInstanceCreating(session, response);
    },
    "AMAZON.StopIntent": function (intent, session, response) {
      var speechOutput = "Goodbye";
      response.tell(speechOutput);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask me anything about your aws account.", "You can ask me to help you with your amazon services.");
    }
};

function handleInstanceCreating(session, response) {
  var speechText = "";
  var plan = intent.slot['Plan'].value;
  var name = intent.slot['Name'].value;

  awsCaller.SpawnInstance(plan, name);

  speechText = `Your instance ${name} is created!`;
  var speechOutput = {
    speech: speechText,
    type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };

  response.tell(speechOutput)
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var helloWorld = new HelloWorld();
    helloWorld.execute(event, context);
};

