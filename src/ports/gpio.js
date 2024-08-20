const Gpio = require('onoff').Gpio;
const configRepository = require("repository/config.js");
const DEBUG = process.env.DEBUG ? process.env.DEBUG === 'true' : false;

class GpioPort {
    config = configRepository.readConfig(configFile);
    deviceNumber = config.gpioDeviceId || 535;
    
    setGPIO(isHigh) {
        if(DEBUG) return;
        console.info(`${isHigh ? "Enabling" : "Disabling"} sprinkler on GPIO ${deviceNumber}`);
        const pin = new Gpio(deviceNumber, 'out');
        pin.writeSync(isHigh ? 1 : 0);
      }
}

module.exports = new GpioPort();