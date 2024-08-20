'use strict';

const forecastService = require("service/forecast.js");
const gpioPort = require("ports/gpio.js");

(async () => 
  forecastService.shouldIrrigate() ? gpioPort.setGPIO(true) :  gpioPort.setGPIO(false)
)();
