const Gpio = require('onoff').Gpio;

const
  ON  = 1,
  OFF = 0;

const led4 = new Gpio(4, 'out');
const button17 = new Gpio(17, 'in', 'both');

const blink = (led, value = 1) => {
  led.write(value, () => {
    console.log(`led ${value}`)
    setTimeout(() => blink(led, value ? 0 : 1), 1000);
  });
};

blink(led4, 1);

button17.watch((err, value) => {
  if (err) {
    console.error(err);
  }

  console.log('button change', value);
});

process.on('SIGINT', () => {
  led4.unexport();
});
