'use strict';

const forecastService = require("./services/forecast.js");
const gpioPort = require("./ports/gpio.js");

(async () => {
  const sprinklerEnable = await forecastService.shouldIrrigate();
  sprinklerEnable ? gpioPort.setGPIO(true) : gpioPort.setGPIO(false);
})();
