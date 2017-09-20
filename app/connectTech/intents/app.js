'use strict';
const makeCard = require('./lib/makeCard.js'),
  ronSwansonApi = require('./lib/ronSwansonApi.js'),
  audiofiles = require('./lib/audiofile.js'),
  _ = require('lodash');

/**
 * Watercooler contains all of the custom and built in intents we are using for the skill.
 **/


let connectTech = function (app) {
  app.makeCard = makeCard;
  app.ronSwansonApi = ronSwansonApi;
  app.audiofiles = audiofiles;
  app._ = _;

  /**
   * app.pre is run before every request.
   */
  // app.pre = function (request) {
  //
  // };


  /**
   *  Custom Intents:
   *      launch
   *      getRonSwansonQuote
   *      audioPlayer
   **/
  app.launch(function (request, response) {
    response.say('Quote or tunes?');
    response.shouldEndSession(false, 'What did you say?').send();
  });

  app.intent('getRonSwansonQuote', (request, response) => {
    return app.ronSwansonApi.getQuote()
      .then( (quote) => {
        let finalQuote = quote;
        app.makeCard(finalQuote, response, 'ron');
        return response.say(`Ron Swanson says: ${finalQuote}`, 'Would you like to hear another quote?')
          .shouldEndSession(false, 'Say that again?')
          .send();
      } );
  });

  app.intent('audioPlayer', {
    slots: {NAME: 'NAME'}
  }, (request, response) => {

  });

  /**
   *  Amazon built-in intents:
   *      AMAZON.NextIntent,
   *      AMAZON.PauseIntent,
   *      AMAZON.ResumeIntent,
   *      AMAZON.StopIntent,
   *      AMAZON.CancelIntent
   *      AMAZON.HelpIntent
   **/
  app.intent('AMAZON.CancelIntent', (request, response) => {
    return response.say('Goodbye, cruel world!')
      .shouldEndSession(true)
      .send();
  });

};

module.exports = connectTech;
