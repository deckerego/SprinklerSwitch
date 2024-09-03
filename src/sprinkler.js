'use strict';

const metricsService = require("./services/metrics.js");
const rulesService = require("./services/rules.js");
const gpioPort = require("./ports/gpio.js");

(async () => {
  const facts = await metricsService.fetch();
  const sprinklerEnable = rulesService.evaluate(facts);
  sprinklerEnable ? gpioPort.setGPIO(true) : gpioPort.setGPIO(false);
})();
