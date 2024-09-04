const configRepository = require("../repositories/config.js");

class RulesService {
    precipitationRateThreshold = configRepository.get("precipitationRateThreshold", 10.0);
    precipitableWaterThreshold = configRepository.get("precipitableWaterThreshold", 50.0);
    cloudWaterThreshold = configRepository.get("cloudWaterThreshold", 1.0);

    evaluate(facts) {
        return !(
            exceedsPrecipitationThreshold(facts.priorAccumulation, facts.forecastAccumulation) &&
            exceedsWaterThreshold(facts.maxPrecipitable, facts.maxCloudWater)
        );
    }

    exceedsWaterThreshold(preciptable, cloudWater) {
        return preciptable > precipitableWaterThreshold || cloudWater > cloudWaterThreshold
    }

    exceedsPrecipitationThreshold(priorAccumulation, forecastAccumulation) {
        return (priorAccumulation + forecastAccumulation) > precipitationRateThreshold
    }
}

module.exports = new RulesService();