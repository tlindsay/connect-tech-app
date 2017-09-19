'use strict';

const nconf = require('nconf');

let environment,
    port,
    config;

config = {
    default: {
        appName: 'connect-tech-app',
        ronSwansonApi: {
            v1: {
                url: 'http://ron-swanson-quotes.herokuapp.com/v2'
            }
        },
        audioApi: {
            v1: {
                url: 'https://api.napster.com/v2.1/tracks/top?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm'
            }
        }
    }
};

nconf.env().argv();
// make sure we have an environment set or die
environment = nconf.get('ENVIRONMENT');
port = nconf.get('PORT');

if (typeof environment === 'undefined' || typeof port === 'undefined') {
    console.error(`ENVIRONMENT and/or PORT are not set. Shutting down.  ENVIRONMENT: ${environment} - PORT: ${port}`);
    process.exit(1);
}

// load the correct config based on environment
switch (environment.toLowerCase()) {
    case 'dev':
        nconf.defaults(config.dev);
        console.log('Using Dev Config');
        break;
    default:
        console.log('using default');
        nconf.defaults(config.default);
}
/*
 * Load overrides that don't actually override anything, they just fill in the
 * blanks.
 */
nconf.overrides(config.default);


module.exports = nconf;