
const
  google = require('googleapis'),
  sheets = google.sheets('v4');

const RANGE = 'Quotes!B:D';

const readSpreadsheeet = (id, range, api_key) => {
  return new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get({
      auth:          api_key,
      spreadsheetId: id,
      range:         range,
    }, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response.values);
      }
    });
  });
};

const random = (max) => Math.floor(Math.random() * (max + 1));

const formatQuote = (data) => {
  return {
    content: data[0] !== '' ? data[0] : undefined,
    author:  data[1] !== '' ? data[1] : undefined,
  };
};

module.exports = (config) => ({
  random: () => readSpreadsheeet(
      config.SPREADSHEET_ID,
      RANGE,
      config.GOOGLE_API_KEY
    ).then((quotes) => {
      const index = random(quotes.length);
      return formatQuote(quotes[index]);
    }),
});
