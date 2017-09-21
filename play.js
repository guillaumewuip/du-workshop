const player = require('play-sound')({});

player.play('translate_tts.mp3', (err) => {
  if (err) {
    console.error(err);
  }

  console.log('done');
});
