const gfsRepository = require("../repositories/gfs.js");
const configRepository = require("../repositories/config.js");

class MetricsService {
    async fetch() {
        const now = new Date();
        const latitude = configRepository.get("latitude");
        const longitude = configRepository.get("longitude");

        //TODO Convert to kg/m^2
        const precipitationRate = await gfsRepository.getPrecipitationRate(latitude, longitude) || [];
        const priorAccumulation = precipitationRate.reduce((acc, result) => result.time <= now ? acc + result.value : acc, 0);
        const forecastAccumulation = precipitationRate.reduce((acc, result) => result.time > now ? acc + result.value : acc, 0);
        if(precipitationRate[0]) console.info(`Total surface precipitation (kg/m^2/s) @[${precipitationRate[0].latitude}, ${precipitationRate[0].longitude}]: ${priorAccumulation} => ${forecastAccumulation}`);

        const precipitableWater = await gfsRepository.getPrecipitableWater(latitude, longitude) || [];
        const maxPrecipitable = precipitableWater.reduce((acc, result) => result.time > now && result.value > acc ? result.value : acc, 0);
        if(precipitableWater[0]) console.info(`Maximum precipitable water (kg/m^2) @[${precipitableWater[0].latitude}, ${precipitableWater[0].longitude}]: ${maxPrecipitable}`);

        const cloudWater = await gfsRepository.getCloudWater(latitude, longitude) || [];
        const maxCloudWater = cloudWater.reduce((acc, result) => result.time > now && result.value > acc ? result.value : acc, 0);
        if(cloudWater[0]) console.info(`Maximum cloud water (kg/m^2) @[${cloudWater[0].latitude}, ${cloudWater[0].longitude}]: ${maxCloudWater}`);

        const relativeHumidity = await gfsRepository.getRelativeHumidity(latitude, longitude) || [];
        const priorRelativeHumidity = relativeHumidity.reduce((acc, result) => result.time <= now && result.value < acc ? result.value : acc, Number.MAX_SAFE_INTEGER);
        const forecastRelativeHumidity = relativeHumidity.reduce((acc, result) => result.time > now && result.value < acc ? result.value : acc, Number.MAX_SAFE_INTEGER);
        if(relativeHumidity[0]) console.info(`Least relative humidity 30-0 millibars above ground (%) @[${relativeHumidity[0].latitude}, ${relativeHumidity[0].longitude}]: ${priorRelativeHumidity} => ${forecastRelativeHumidity}`);

        const groundTemp = await gfsRepository.getGroundTemperature(latitude, longitude) || [];
        const priorGroundTemp = groundTemp.reduce((acc, result) => result.time <= now && result.value > acc ? result.value : acc, 0);
        const forecastGroundTemp = groundTemp.reduce((acc, result) => result.time > now && result.value > acc ? result.value : acc, 0);
        if(groundTemp[0]) console.info(`Average temperature 30-0 millibars above ground (k) @[${groundTemp[0].latitude}, ${groundTemp[0].longitude}]: ${priorGroundTemp} => ${forecastGroundTemp}`);

        return {
            priorAccumulation: priorAccumulation,
            forecastAccumulation: forecastAccumulation,
            maxPrecipitable: maxPrecipitable,
            maxCloudWater: maxCloudWater,
            priorRelativeHumidity: priorRelativeHumidity,
            forecastRelativeHumidity: forecastRelativeHumidity,
            priorGroundTemp: priorGroundTemp,
            forecastGroundTemp: forecastGroundTemp
        }
    }
}

module.exports = new MetricsService();