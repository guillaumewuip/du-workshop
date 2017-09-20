const Gpio = require('onoff').Gpio;

const
  ON  = 1,
  OFF = 0;

const led4 = new Gpio(4, 'out');

const blink = (led, value = 1) => {
  led.write(value, () => {
    console.log(`led ${value}`)
    setTimeout(() => blink(led, value ? 0 : 1), 1000);
  });
};

blink(led4, 1);

process.on('SIGINT', () => {
  led4.unexport();
});
