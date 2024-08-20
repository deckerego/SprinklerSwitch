const Gpio = require('onoff').Gpio;
const configRepository = require("../repositories/config.js");
const DEBUG = process.env.DEBUG ? process.env.DEBUG === 'true' : false;

class GpioPort {
  setGPIO(isHigh) {
    const deviceNumber = configRepository.get("gpioDeviceId", 535);
    console.info(`${isHigh ? "Enabling" : "Disabling"} sprinkler on GPIO ${deviceNumber}`);
    if (DEBUG) return;
    const pin = new Gpio(deviceNumber, 'out');
    pin.writeSync(isHigh ? 1 : 0);
  }
}

module.exports = new GpioPort();