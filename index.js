
const dotenv        = require('dotenv');
const Twit          = require('twit');
const schedule      = require('node-schedule');
const debounce      = require('debounce');
const quotesWrapper = require('./quotes');
const twitterHelper = require('./twitter');
const buttonHelper  = require('./button');
const soundHelper   = require('./sounds');

dotenv.config();

const TIME_TO_TOUCH = .5 * 60 * 1000; // time to desactivate the button
const TWITTER_MENTION = '@guillaumewuip';

const
  SPREADSHEET_ID = (() => {
    if (!process.env.SPREADSHEET_ID) {
      throw new Error('Need SPREADSHEET_ID env var');
    }

    return process.env.SPREADSHEET_ID;
  })(),

  GOOGLE_API_KEY = (() => {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Need GOOGLE_API_KEY env var');
    }

    return process.env.GOOGLE_API_KEY;
  })(),

  TWITTER_CONSUMER_KEY = (() => {
    if (!process.env.TWITTER_CONSUMER_KEY) {
      throw new Error('Need TWITTER_CONSUMER_KEY');
    }
    return process.env.TWITTER_CONSUMER_KEY;
  })(),

  TWITTER_CONSUMER_SECRET = (() => {
    if (!process.env.TWITTER_CONSUMER_SECRET) {
      throw new Error('Need TWITTER_CONSUMER_SECRET');
    }
    return process.env.TWITTER_CONSUMER_SECRET;
  })(),

  TWITTER_ACCESS_TOKEN = (() => {
    if (!process.env.TWITTER_ACCESS_TOKEN) {
      throw new Error('Need TWITTER_ACCESS_TOKEN');
    }
    return process.env.TWITTER_ACCESS_TOKEN;
  })(),

  TWITTER_ACCESS_TOKEN_SECRET = (() => {
    if (!process.env.TWITTER_ACCESS_TOKEN_SECRET) {
      throw new Error('Need TWITTER_ACCESS_TOKEN_SECRET');
    }
    return process.env.TWITTER_ACCESS_TOKEN_SECRET;
  })();

const quotes = quotesWrapper({ SPREADSHEET_ID, GOOGLE_API_KEY });

const T = new Twit({
  consumer_key:        TWITTER_CONSUMER_KEY,
  consumer_secret:     TWITTER_CONSUMER_SECRET,
  access_token:        TWITTER_ACCESS_TOKEN,
  access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms:          60 * 1000, //not too low because stream will fail
});

const sendTweets = (T, id) => {
  return (msgs) => Promise.all(
    msgs.map((msg) => twitterHelper.send(T)(msg, id))
  );
};

const sendRandomQuote = (T) => {
  quotes.random()
    .then((msg) => ({
      content: `${TWITTER_MENTION} ${msg.content}`,
      author:  msg.author,
    }))
    .then(twitterHelper.buildQuote)
    .then(twitterHelper.buildTweets)
    .then(sendTweets(T))
    .then(() => {
      console.log('Twitter status send');
    })
    .catch((err) => {
      console.error(err);
    });
};

const timeout = {
  isSet: false,
  _timeout: null,
  clear: () => {
    if (timeout._timeout) {
      clearTimeout(timeout._timeout);
      timeout.isSet = false;
    }
  },
  setTimeout: (callback, time) => {
    timeout._timeout = setTimeout(callback, time);
    timeout.isSet = true;
  },
};

const watchHandler = (err) => {
  if (err) {
    console.error(err);
  }

  if (timeout.isSet) {
    timeout.clear();
    soundHelper.playRandom();
    buttonHelper.off();
  }
};

buttonHelper.watch(debounce(watchHandler, 500));

schedule.scheduleJob('0 */2 8-18 * * *', () => { // TODO remove every 4 min
  buttonHelper.on();
  timeout.setTimeout(() => {
    sendRandomQuote(T);
  }, TIME_TO_TOUCH);
});

