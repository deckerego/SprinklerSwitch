const configRepository = require("../repositories/config.js");

class RulesService {
    precipitationRateThreshold = configRepository.get("precipitationRateThreshold", 10.0);
    precipitableWaterThreshold = configRepository.get("precipitableWaterThreshold", 50.0);
    cloudWaterThreshold = configRepository.get("cloudWaterThreshold", 1.0);

    evaluate(facts) {
        return !(
            this.exceedsPrecipitationThreshold(facts.priorAccumulation, facts.forecastAccumulation) &&
            this.exceedsWaterThreshold(facts.maxPrecipitable, facts.maxCloudWater)
        );
    }

    exceedsWaterThreshold(preciptable, cloudWater) {
        return (preciptable > this.precipitableWaterThreshold) || (cloudWater > this.cloudWaterThreshold);
    }

    exceedsPrecipitationThreshold(priorAccumulation, forecastAccumulation) {
        return (priorAccumulation + forecastAccumulation) > this.precipitationRateThreshold;
    }
}

module.exports = new RulesService();