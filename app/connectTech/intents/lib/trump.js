'use strict';

const config = require('../../config/config'),
    request = require('request-promise');

let api;

function getRandomTrumpQuote() {
  let URL = 'https://api.tronalddump.io/random/quote';
  let options = {
    method: 'GET',
    uri: URL,
    headers: {
      Accept: 'applcation/json'
    },
    transform: function(body) {
      body = JSON.parse(body);
      return body.value;
    }
  };

  return request(options);
}

api = {
  getRandomTrumpQuote
};

module.exports = api;
