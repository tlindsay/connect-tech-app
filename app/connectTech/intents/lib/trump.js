'use strict';

const config = require('../../config/config'),
    request = require('request-promise');

let api;
let baseURL = 'https://api.tronalddump.io'

function getRandomTrumpQuote() {
  let URL = `${baseURL}/random/quote`;
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

function getTrumpQuoteAbout(subject) {
  let URL = `${baseURL}/search/quote?query=${encodeURI(subject)}`;
  let options = {
    method: 'GET',
    uri: URL,
    headers: {
      Accept: 'application/json'
    },
    transform: function(body) {
      body = JSON.parse(body);
      return body._embedded.quotes[0].value;
    }
  };
  return request(options)
}

api = {
  getRandomTrumpQuote,
  getTrumpQuoteAbout
};

module.exports = api;
