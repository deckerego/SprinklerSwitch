const gfsRepository = require("../repositories/gfs.js");
const configRepository = require("../repositories/config.js");

class ForecastService {
    async shouldIrrigate() {
        const now = new Date();
        const rainThreshold = configRepository.get("precipitationRateThreshold", 0.001);
        const latitude = configRepository.get("latitude");
        const longitude = configRepository.get("longitude");

        const precipitationRate = await gfsRepository.getPrecipitationRate(latitude, longitude);
        const priorAccumulation = precipitationRate.reduce((acc, result) => result.time <= now ? acc + result.value : acc, 0);
        const forecastAccumulation = precipitationRate.reduce((acc, result) => result.time > now ? acc + result.value : acc, 0);
        console.info(`Surface precipitation (kg/m^2/s): ${priorAccumulation} + ${forecastAccumulation} = ${priorAccumulation + forecastAccumulation}`);

        return (priorAccumulation + forecastAccumulation) <= rainThreshold;
    }
}

module.exports = new ForecastService();