const Gpio = require('onoff').Gpio;

const
  ON  = 1,
  OFF = 0;

const led = new Gpio(4, 'out');


led.write(ON, () => console.log('led ON'));

process.on('SIGINT', function () {
  led.unexport();
});
