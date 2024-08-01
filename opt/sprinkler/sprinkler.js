'use strict';

const Gpio = require('onoff').Gpio;
const noaa_gfs = require("noaa-gfs-js");
const GPIO_23 = 535;
const DEBUG = true;
const PRECIP_RATE_THRESHOLD = 0.001;

async function forecast(lat, lon) {
  const surfacePrecipRate = await getMetric(lat, lon, 'pratesfc');
  console.info(`Aggregated ${surfacePrecipRate.length} pratesfc values`);

  const now = new Date();
  const priorAccumulation = surfacePrecipRate.reduce((acc, result) => result.time <= now ? acc + result.value : acc, 0);
  const forecastAccumulation = surfacePrecipRate.reduce((acc, result) => result.time > now ? acc + result.value : acc, 0);
  console.debug(`Prior pratesfc: ${priorAccumulation}; Forecast pratesfc: ${forecastAccumulation}`);

  if(priorAccumulation + forecastAccumulation > PRECIP_RATE_THRESHOLD) disable();
  else enable();
}

async function getMetric(lat, long, metric) {
  const yesterday = getYesterday();
  const results = await noaa_gfs.get_gfs_data('0p25', yesterday.dateString, yesterday.hourString, [lat,lat], [long,long], 16, metric, true);
  console.info(`Fetched ${results.array_format.length} results from NOAA`);

  const aggregate = results.array_format.reduce((acc, result) => {
    const resultTime = new Date(result.time);
    resultTime.setDate(resultTime.getDate() + 1); // Fix defect in date calculation
    if(acc.has(result.time)) {
      const avgResult = acc.get(result.time);
      acc.set(result.time, {
        time: resultTime,
        value: ((avgResult.value * avgResult.sampleCount) + result.value) / (avgResult.sampleCount + 1),
        sampleCount: avgResult.sampleCount + 1
      });
    } else {
      acc.set(result.time, {
        time: resultTime,
        value: result.value,
        sampleCount: 1
      });
    }
    return acc;
  }, new Map());

  return Array.from(aggregate.values());
}

function getYesterday() {
  const yesterday = new Date();
  yesterday.setHours(yesterday.getHours() - 24);
  const year = String(yesterday.getFullYear());
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const date = String(yesterday.getDate()).padStart(2, '0');
  const hour = String(yesterday.getHours() - (yesterday.getHours() % 6)).padStart(2, '0');
  return {
    dateString: year+month+date,
    hourString: hour
  };
}

function enable() {
  setGPIO(GPIO_23, true);
  console.info("Enabling sprinkler");
}

function disable() {
  setGPIO(GPIO_23, false);
  console.info("Disabling sprinkler");
}

function setGPIO(deviceNumber, isHigh) {
  if(DEBUG) return;
  const pin = new Gpio(deviceNumber, 'out');
  pin.writeSync(isHigh ? 1 : 0);
}

(async () => {
  await forecast(40.125, -86.333);
})();
