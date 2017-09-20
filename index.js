const Gpio = require('onoff').Gpio;

const ON_INTERVAL = 4000;

const led4 = new Gpio(4, 'out');
const button17 = new Gpio(17, 'in', 'both');

const actionLed = (value) => (led) => {
  led.write(value, () => {
    console.log(`led ${value}`);
  });
};

const
  on = actionLed(1),
  off = actionLed(0);

off(led4);

setInterval(() => on(led4), ON_INTERVAL);

button17.watch((err) => {
  if (err) {
    console.error('button error', err);
  }

  off(led4);
});

process.on('SIGINT', () => {
  led4.unexport();
});
