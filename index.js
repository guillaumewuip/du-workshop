
const dotenv = require('dotenv');
const quotesWrapper = require('./quotes');

dotenv.config();

const SPREADSHEET_ID = (() => {
  if (!process.env.SPREADSHEET_ID) {
    throw new Error('Need SPREADSHEET_ID env var');
  }

  return process.env.SPREADSHEET_ID;
})();

const GOOGLE_API_KEY = (() => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('Need GOOGLE_API_KEY env var');
  }

  return process.env.GOOGLE_API_KEY;
})();

const quotes = quotesWrapper({ SPREADSHEET_ID, GOOGLE_API_KEY });

quotes
  .random()
  .then(console.log)
  .catch(console.error);
