
const csv = require('csv');
const fs = require('fs');

const FILE = './citations.csv';

const readSpreadsheeet = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(FILE, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      csv.parse(data, (err, rows) => {
        console.log(rows);
        resolve(rows);
      });
    });
  });
};

const random = (max) => Math.floor(Math.random() * (max + 1));

const formatQuote = (data) => {
  return {
    content: data[1] !== '' ? data[1] : undefined,
    author:  data[2] !== '' ? data[2] : undefined,
  };
};

module.exports = (config) => ({
  readSpreadsheeet: () => readSpreadsheeet(FILE),
  random: () => readSpreadsheeet(FILE)
    .then((quotes) => {
      const index = random(quotes.length);
      return formatQuote(quotes[index]);
    }),
});
