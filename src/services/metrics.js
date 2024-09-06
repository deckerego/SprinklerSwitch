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
        const maxPrecipitable = precipitableWater.reduce((acc, result) => result.time > now && result.value > acc ? result.value : acc, 0);
        if(precipitableWater[0]) console.info(`Maximum precipitable water (kg/m^2) @[${precipitableWater[0].latitude}, ${precipitableWater[0].longitude}]: ${maxPrecipitable}`);

        const cloudWater = data[2] || [];
        const maxCloudWater = cloudWater.reduce((acc, result) => result.time > now && result.value > acc ? result.value : acc, 0);
        if(cloudWater[0]) console.info(`Maximum cloud water (kg/m^2) @[${cloudWater[0].latitude}, ${cloudWater[0].longitude}]: ${maxCloudWater}`);

        const groundTemp = data[3] || [];
        const priorGroundTemp = groundTemp.reduce((acc, result) => result.time <= now && result.value > acc ? result.value : acc, 0);
        const forecastGroundTemp = groundTemp.reduce((acc, result) => result.time > now && result.value > acc ? result.value : acc, 0);
        if(groundTemp[0]) console.info(`Maximum temperature (k) @[${groundTemp[0].latitude}, ${groundTemp[0].longitude}]: ${priorGroundTemp} => ${forecastGroundTemp}`);

        const specificHumidity = data[4] || [];
        const priorSpecificHumidity = specificHumidity.reduce((acc, result) => result.time <= now && result.value < acc ? result.value : acc, Number.MAX_SAFE_INTEGER);
        const forecastSpecificHumidity = specificHumidity.reduce((acc, result) => result.time > now && result.value < acc ? result.value : acc, Number.MAX_SAFE_INTEGER);
        const forecastGroundTempC = forecastGroundTemp - 273.15;
        const maxSpecificHumidity = 0.003733 + (0.00032 * forecastGroundTempC) + (0.000003 * forecastGroundTempC) + (0.0000004 * forecastGroundTempC);
        if(specificHumidity[0]) console.info(`Lowest specific humidity (kg/kg) @[${specificHumidity[0].latitude}, ${specificHumidity[0].longitude}]: ${priorSpecificHumidity} => ${forecastSpecificHumidity} [${maxSpecificHumidity}]`);

        const windSpeed = data[5] || [];
        const futureWindSpeed = windSpeed.filter(result => result.time > now);
        const avgWindSpeed = futureWindSpeed.reduce((acc, result, i) => ((acc * i) + result.value) / (i+1), 0);
        if(windSpeed[0]) console.info(`Average wind speed (m/s) @[${windSpeed[0].latitude}, ${windSpeed[0].longitude}]: ${avgWindSpeed}`);

        const evaporationRate = (25 + 19 * avgWindSpeed) * 1 * (maxSpecificHumidity - forecastSpecificHumidity);
        if(specificHumidity[0]) console.info(`Evaporation rate (kg/h) @[${specificHumidity[0].latitude}, ${specificHumidity[0].longitude}]: ${evaporationRate}`);

        return {
            priorAccumulation: priorAccumulation,
            forecastAccumulation: forecastAccumulation,
            maxPrecipitable: maxPrecipitable,
            maxCloudWater: maxCloudWater,
            priorSpecificHumidity: priorSpecificHumidity,
            forecastSpecificHumidity: forecastSpecificHumidity,
            forecastMaxSpecificHumidity: maxSpecificHumidity,
            priorGroundTemp: priorGroundTemp,
            forecastGroundTemp: forecastGroundTemp,
            windSpeed: avgWindSpeed,
            forecastEvaporationRate: evaporationRate,
        }
    }
}

module.exports = new MetricsService();