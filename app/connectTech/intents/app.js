'use strict';
const makeCard = require('./lib/makeCard.js'),
  ronSwansonApi = require('./lib/ronSwansonApi.js'),
  audiofiles = require('./lib/audiofile.js'),
  trump = require('./lib/trump.js'),
  _ = require('lodash');

/**
 * Watercooler contains all of the custom and built in intents we are using for the skill.
 **/


let connectTech = function (app) {
  app.makeCard = makeCard;
  app.ronSwansonApi = ronSwansonApi;
  app.audiofiles = audiofiles;
  app.trump = trump;
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
    let name = request.slot('NAME');
    return app.audiofiles.getPlaylist(name)
      .then( (playlist) => {
        console.log('playlist------', playlist.album.images[0]);
        let track = playlist.preview_url,
          trackName = playlist.name,
          trackImage = playlist.album.images[0].url,
          audioPlayerPayload = {
            url: track,
            token: trackName,
            expectedPreviousToken: 'some_previous_token',
            offsetInMilliseconds: 0
          };
        app.makeCard(trackName, response, trackImage);
        console.log('response', JSON.stringify(response, null, 2));
        return response.audioPlayerPlayStream('ENQUEUE', audioPlayerPayload).send();
      } ).catch((error) => {
        console.log('error', error);
      });
  });

  app.intent('randomTrumpQuote', {}, (request, response) => {
    return app.trump.getRandomTrumpQuote().then((quote) => {
      console.log(quote);
      return response.say(`Trump says: "${quote}". Can you believe he's the president?`);
    }).catch((error) => {
      console.log('error', error);
    });
  });

  app.intent('trumpQuoteAbout', {
    slots: {NAME: 'NAME'}
  }, (request, response) => {
    let subject = request.slot('NAME');
    return app.trump.getTrumpQuoteAbout(subject).then((quote) => {
      console.log(quote);
      return response.say(`Trump says: "${quote}".`);
    }).catch((error) => {
      console.log('error', error);
    });
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
