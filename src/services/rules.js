const configRepository = require("../repositories/config.js");

class RulesService {
    precipitableWaterThreshold = configRepository.get("precipitableWaterThreshold", 50.0);
    cloudWaterThreshold = configRepository.get("cloudWaterThreshold", 1.0);

    evaluate(facts) {
        return !(
            this.isRainSufficient(facts) ||
            this.isRainExpected(facts)
        );
    }

    isRainExpected(facts) {
        return (facts.maxPrecipitable > this.precipitableWaterThreshold) || (facts.maxCloudWater > this.cloudWaterThreshold);
    }

    isRainSufficient(facts) {
        return (facts.priorAccumulation + facts.forecastAccumulation) > facts.forecastEvaporationRate;
    }
}

module.exports = new RulesService();