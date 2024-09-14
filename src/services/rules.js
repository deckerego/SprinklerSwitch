const configRepository = require("../repositories/config.js");

class RulesService {
    precipitableWaterThreshold = configRepository.get("precipitableWaterThreshold", 50.0);
    cloudWaterThreshold = configRepository.get("cloudWaterThreshold", 1.0);
    turfNerf = configRepository.get("soilRetentionFactor", 0.5); // How much do we think grass reduces the evaporation rate?

    evaluate(facts) {
        return !(
            this.isRainSufficient(facts) || // Is rain expected to happen in the near future, OR
            this.isRainExpected(facts)      // Did we get enough rain in the recent past?
        );
    }

    isRainExpected(facts) { 
        return (facts.maxPrecipitable > this.precipitableWaterThreshold) || (facts.maxCloudWater > this.cloudWaterThreshold);
    }

    isRainSufficient(facts) { 
        return (facts.priorAccumulation + facts.forecastAccumulation) >= (facts.forecastEvaporationRate * this.turfNerf);
    }
}

module.exports = new RulesService();