const gfsRepository = require("../repositories/gfs.js");
const configRepository = require("../repositories/config.js");

class ForecastService {
    async shouldIrrigate() {
        const now = new Date();
        const rainThreshold = configRepository.get("precipitationRateThreshold", 0.001);
        const latitude = configRepository.get("latitude");
        const longitude = configRepository.get("longitude");

        const precipitationRate = await gfsRepository.getPrecipitationRate(latitude, longitude) || [];
        const priorAccumulation = precipitationRate.reduce((acc, result) => result.time <= now ? acc + result.value : acc, 0);
        const forecastAccumulation = precipitationRate.reduce((acc, result) => result.time > now ? acc + result.value : acc, 0);
        const totalAccumulation = priorAccumulation + forecastAccumulation;
        console.info(`Total surface precipitation (kg/m^2/s): ${priorAccumulation} + ${forecastAccumulation} = ${totalAccumulation}`);

        const precipitableWater = await gfsRepository.getPrecipitableWater(latitude, longitude) || [];
        const maxPrecipitable = precipitableWater.reduce((acc, result) => result.time > now && result.value > acc ? result.value : acc, 0);
        console.info(`Maximum precipitable water (kg/m^2): ${maxPrecipitable}`);

        const cloudWater = await gfsRepository.getCloudWater(latitude, longitude) || [];
        const maxCloudWater = cloudWater.reduce((acc, result) => result.time > now && result.value > acc ? result.value : acc, 0);
        console.info(`Maximum cloud water (kg/m^2): ${maxCloudWater}`);

        const relativeHumidity = await gfsRepository.getRelativeHumidity(latitude, longitude) || [];
        const priorRelativeHumidity = relativeHumidity.reduce((acc, result) => result.time <= now && result.value < acc ? result.value : acc, Number.MAX_SAFE_INTEGER);
        const forecastRelativeHumidity = relativeHumidity.reduce((acc, result) => result.time > now && result.value < acc ? result.value : acc, Number.MAX_SAFE_INTEGER);
        const minRelativeHumidity = Math.min(priorRelativeHumidity, forecastRelativeHumidity);
        console.info(`Least relative humidity 30-0 millibars above ground (%): MIN(${priorRelativeHumidity}, ${forecastRelativeHumidity}) = ${minRelativeHumidity}`);

        const groundTemp = await gfsRepository.getGroundTemperature(latitude, longitude) || [];
        const priorGroundTemp = groundTemp.reduce((acc, result) => result.time <= now && result.value > acc ? result.value : acc, 0);
        const forecastGroundTemp = groundTemp.reduce((acc, result) => result.time > now && result.value > acc ? result.value : acc, 0);
        const avgGroundTemp = (priorGroundTemp + forecastGroundTemp) / 2;
        console.info(`Average temperature 30-0 millibars above ground (k): AVG(${priorGroundTemp}, ${forecastGroundTemp}) = ${avgGroundTemp}`);

        return totalAccumulation <= rainThreshold;
    }
}

module.exports = new ForecastService();