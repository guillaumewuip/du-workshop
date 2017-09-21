
const fs     = require('fs');
const player = require('play-sound')();

const nbSounds = fs.readdirSync('./mp3').length;

const random = (max) => Math.floor(Math.random() * (max + 1));

module.exports = {
  playRandom: () => {
    const index = random(nbSounds - 1);

    player.play(`mp3/${index + 1}.mp3`, (err) => {
      if (err) {
        console.error(err);
      }

      console.log(`Played sound ${index + 1}.mp3`);
    });
  }
};
