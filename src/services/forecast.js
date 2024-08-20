const gfsRepository = require("repositories/gfs.js");
const configRepository = require("repository/config.js");

class ForecastService {
    config = configRepository.readConfig(configFile);
    rainThreshold = config.precipitationRateThreshold || 0.001;

    async shouldIrrigate() {
        const now = new Date();

        const precipitationRate = await gfsRepository.getPrecipitationRate(config.latitude, config.longitude);
        const priorAccumulation = precipitationRate.reduce((acc, result) => result.time <= now ? acc + result.value : acc, 0);
        const forecastAccumulation = precipitationRate.reduce((acc, result) => result.time > now ? acc + result.value : acc, 0);
        console.info(`Surface precipitation (kg/m^2/s): ${priorAccumulation} + ${forecastAccumulation} = ${priorAccumulation + forecastAccumulation}`);

        return priorAccumulation + forecastAccumulation <= rainThreshold;
    }
}