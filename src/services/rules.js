const configRepository = require("../repositories/config.js");

class RulesService {
    precipitableWaterThreshold = configRepository.get("precipitableWaterThreshold", 50.0);
    cloudWaterThreshold = configRepository.get("cloudWaterThreshold", 1.0);

    evaluate(facts) {
        return !(
            this.exceedsPrecipitationThreshold(facts) &&
            this.exceedsWaterThreshold(facts)
        );
    }

    exceedsWaterThreshold(facts) {
        return (facts.maxPrecipitable > this.precipitableWaterThreshold) || (facts.maxCloudWater > this.cloudWaterThreshold);
    }

    exceedsPrecipitationThreshold(facts) {
        return (facts.priorAccumulation + facts.forecastAccumulation) > facts.forecastEvaporationRate;
    }
}

module.exports = new RulesService();