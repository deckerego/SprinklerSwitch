const configRepository = require("../repositories/config.js");

class RulesService {
    async evaluate(facts) {
        const precipitationRateThreshold = configRepository.get("precipitationRateThreshold", 0.001);
        const precipitableWaterThreshold = configRepository.get("precipitableWaterThreshold", 50.0);
        return !(
            ((facts.priorAccumulation + facts.forecastAccumulation) > precipitationRateThreshold) &&
            (facts.maxPrecipitable > precipitableWaterThreshold)
        );
    }
}

module.exports = new RulesService();