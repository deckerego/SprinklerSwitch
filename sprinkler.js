'use strict';

const Gpio = require('onoff').Gpio;
const noaa_gfs = require("noaa-gfs-js");
const fs = require('node:fs');
const haversine = require('haversine-distance');

const GPIO_PIN = process.env.GPIO_DEVICE_ID || 535;
const DEBUG = process.env.DEBUG ? process.env.DEBUG === 'true' : true;
const PRECIP_RATE_THRESHOLD = process.env.PRECIP_RATE_THRESHOLD || 0.001;

async function forecast(lat, lon) {
  const surfacePrecipRate = await getAggregateMetric(lat, lon, 'pratesfc');
  const now = new Date();
  const priorAccumulation = surfacePrecipRate.reduce((acc, result) => result.time <= now ? acc + result.value : acc, 0);
  const forecastAccumulation = surfacePrecipRate.reduce((acc, result) => result.time > now ? acc + result.value : acc, 0);
  console.info(`Surface precipitation (kg/m^2/s): ${priorAccumulation} + ${forecastAccumulation} = ${priorAccumulation + forecastAccumulation}`);

  if((priorAccumulation + forecastAccumulation) > PRECIP_RATE_THRESHOLD) disable();
  else enable();
}

async function getAggregateMetric(lat, lon, metric) {
  const metrics = await getMetric(lat, lon, metric);
  console.info(`Fetched ${metrics.array_format.length} ${metric} results from NOAA`);
  if(DEBUG) console.debug(metrics.array_format.map(result => `${new Date(result.time).toISOString()},${result.lat},${result.lon},${metric},${result.value}`));

  const aggregateMetrics = aggregate(lat, lon, metrics);
  console.info(`Aggregated ${aggregateMetrics.length} ${metric} values`);
  if(DEBUG) console.debug(aggregateMetrics.map(result => `${new Date(result.time).toISOString()},${metric},${result.value}`));

  return aggregateMetrics;
}

async function getMetric(lat, lon, metric) {
  const yesterday = getYesterday();
  return await noaa_gfs.get_gfs_data('0p25', yesterday.dateString, yesterday.hourString, [lat,lat], [lon,lon], 16, metric, true);
}

function aggregate(lat, lon, results) {
  const maxDistance = haversine([results.lats[0], results.lats[1]], [results.lons[0], results.lons[1]]);

  const aggregate = results.array_format.reduce((acc, result) => {
    const resultTime = new Date(result.time);
    const distance = haversine([lat, lon], [result.lat, result.lon]);
    const magnitude = 1 - (distance / maxDistance);
    const weightedValue = magnitude * result.value;

    if(acc.has(result.time)) {
      const avgResult = acc.get(result.time);
      acc.set(result.time, {
        time: resultTime,
        value: Math.max(weightedValue, avgResult.value)
      });
    } else {
      acc.set(result.time, {
        time: resultTime,
        value: weightedValue
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
  setGPIO(GPIO_PIN, true);
  console.info("Enabling sprinkler");
}

function disable() {
  setGPIO(GPIO_PIN, false);
  console.info("Disabling sprinkler");
}

function setGPIO(deviceNumber, isHigh) {
  if(DEBUG) return;
  const pin = new Gpio(deviceNumber, 'out');
  pin.writeSync(isHigh ? 1 : 0);
}

function readConfig(path) {
  const data = fs.readFileSync(path, 'utf8');
  return JSON.parse(data);
}

(async () => {
  console.info("Debug is:", process.env.DEBUG);

  const configFile = process.argv[2] || "etc/sprinklerswitch/config.json";
  if(! configFile) {
    console.error("sprinkler.js [CONFIGFILE]");
    return;
  }

  const config = readConfig(configFile);
  await forecast(config.latitude, config.longitude);
})();
