const configRepository = require("../repositories/config.js");

class RulesService {
    precipitableWaterThreshold = configRepository.get("precipitableWaterThreshold", 47.5);
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
        // Only apply turf nerf to positive evaporation rates (actual evaporation)
        // Negative evaporation rates represent net water addition (dew, fog, etc.)
        // which lawn grasses don't impact as much
        const adjustedEvaporationRate = facts.forecastEvaporationRate > 0 
            ? facts.forecastEvaporationRate * this.turfNerf 
            : facts.forecastEvaporationRate;
        return (facts.priorAccumulation + facts.forecastAccumulation) >= adjustedEvaporationRate;
    }
}

module.exports = new RulesService();
