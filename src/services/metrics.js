const gfsRepository = require("../repositories/gfs.js");
const configRepository = require("../repositories/config.js");

class MetricsService {
    async fetch() {
        const now = new Date();
        const latitude = configRepository.get("latitude");
        const longitude = configRepository.get("longitude");

        const data = await Promise.all([ // Fetch data all at once
            gfsRepository.getPrecipitationRate(latitude, longitude),
            gfsRepository.getPrecipitableWater(latitude, longitude),
            gfsRepository.getCloudWater(latitude, longitude),
            gfsRepository.getGroundTemperature(latitude, longitude),
            gfsRepository.getSpecificHumidity(latitude, longitude),
            gfsRepository.getWindSpeed(latitude, longitude),
        ]);

        const precipitationRate = data[0] || [];
        const priorAccumulation = precipitationRate.reduce((acc, result) => result.time <= now ? acc + (result.value * result.duration) : acc, 0);
        const forecastAccumulation = precipitationRate.reduce((acc, result) => result.time > now ? acc + (result.value * result.duration) : acc, 0);
        if(precipitationRate[0]) console.info(`Total surface precipitation (kg/m^2) @[${precipitationRate[0].latitude}, ${precipitationRate[0].longitude}]: ${priorAccumulation} => ${forecastAccumulation}`);

        const precipitableWater = data[1] || [];
        const maxPrecipitable = precipitableWater.reduce((acc, result) => result.time > now && result.value > acc ? result.value : acc, Number.MIN_SAFE_INTEGER);
        if(precipitableWater[0]) console.info(`Maximum precipitable water (kg/m^2) @[${precipitableWater[0].latitude}, ${precipitableWater[0].longitude}]: ${maxPrecipitable}`);

        const cloudWater = data[2] || [];
        const maxCloudWater = cloudWater.reduce((acc, result) => result.time > now && result.value > acc ? result.value : acc, Number.MIN_SAFE_INTEGER);
        if(cloudWater[0]) console.info(`Maximum cloud water (kg/m^2) @[${cloudWater[0].latitude}, ${cloudWater[0].longitude}]: ${maxCloudWater}`);

        const groundTemp = data[3] || [];
        const priorGroundTemp = groundTemp.reduce((acc, result) => result.time <= now && result.value > acc ? result.value : acc, Number.MIN_SAFE_INTEGER);
        const forecastGroundTemp = groundTemp.reduce((acc, result) => result.time > now && result.value > acc ? result.value : acc, Number.MIN_SAFE_INTEGER);
        if(groundTemp[0]) console.info(`Maximum temperature (k) @[${groundTemp[0].latitude}, ${groundTemp[0].longitude}]: ${priorGroundTemp} => ${forecastGroundTemp}`);

        const specificHumidity = data[4] || [];
        const priorSpecificHumidity = specificHumidity.reduce((acc, result) => result.time <= now && result.value < acc ? result.value : acc, Number.MAX_SAFE_INTEGER);
        const forecastSpecificHumidity = specificHumidity.reduce((acc, result) => result.time > now && result.value < acc ? result.value : acc, Number.MAX_SAFE_INTEGER);
        if(specificHumidity[0]) console.info(`Lowest specific humidity (kg/kg) @[${specificHumidity[0].latitude}, ${specificHumidity[0].longitude}]: ${priorSpecificHumidity} => ${forecastSpecificHumidity}`);

        const windSpeed = data[5] || [];
        const futureWindSpeed = windSpeed.filter(result => result.time > now);
        const avgWindSpeed = futureWindSpeed.reduce((acc, result, i) => ((acc * i) + result.value) / (i+1), Number.MIN_SAFE_INTEGER);
        if(windSpeed[0]) console.info(`Average wind speed (m/s) @[${windSpeed[0].latitude}, ${windSpeed[0].longitude}]: ${avgWindSpeed}`);

        const evaporationRate = MetricsService.toEvaporationRate(windSpeed, groundTemp, specificHumidity);
        const maxEvaporationRate = evaporationRate.reduce((acc, result) => result.time > now && (result.value * result.durationHours) > acc ? (result.value * result.durationHours) : acc, Number.MIN_SAFE_INTEGER);
        if(evaporationRate[0]) console.info(`Evaporation rate (kg/m^2/duration) @[${evaporationRate[0].latitude}, ${evaporationRate[0].longitude}]: ${maxEvaporationRate}`);

        return {
            priorAccumulation: priorAccumulation,
            forecastAccumulation: forecastAccumulation,
            maxPrecipitable: maxPrecipitable,
            maxCloudWater: maxCloudWater,
            priorSpecificHumidity: priorSpecificHumidity,
            forecastSpecificHumidity: forecastSpecificHumidity,
            priorGroundTemp: priorGroundTemp,
            forecastGroundTemp: forecastGroundTemp,
            windSpeed: avgWindSpeed,
            forecastEvaporationRate: maxEvaporationRate,
        }
    }

    /**
     * Calculate lawn soil evaporation rate for each specific humidity value provided
     * @param {*} windSpeed Wind speed metrics in m/s
     * @param {*} groundTemp Ground temperature in Kelvin
     * @param {*} specificHumidity Specific humidity in kg per kg
     * @returns A list of evaporation rates over a given duration by timestamp in kg per square meter
     */
    static toEvaporationRate(windSpeed, groundTemp, specificHumidity) {
        const windByTime = windSpeed.reduce((acc, result) => acc.set(result.time.toISOString(), result), new Map());
        const groundTempByTime = groundTemp.reduce((acc, result) => acc.set(result.time.toISOString(), result), new Map());
        return specificHumidity.map((resultHumid) => {
            const resultWind = windByTime.get(resultHumid.time.toISOString());
            const resultTemp = groundTempByTime.get(resultHumid.time.toISOString());
            const resultTempC = resultTemp.value - 273.15;
            const maxSpecificHumidity = 0.003733 + (0.00032 * resultTempC) + (0.000003 * resultTempC) + (0.0000004 * resultTempC);
            return {
                ...resultHumid,
                durationHours: resultHumid.duration / (60 * 60),
                value: (25 + 19 * resultWind.value) * (maxSpecificHumidity - resultHumid.value)
            }
        });
    }
}

module.exports = new MetricsService();
