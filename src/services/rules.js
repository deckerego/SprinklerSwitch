const configRepository = require("../repositories/config.js");

class RulesService {
    precipitationRateThreshold = configRepository.get("precipitationRateThreshold", 5.0);
    precipitableWaterThreshold = configRepository.get("precipitableWaterThreshold", 50.0);
    cloudWaterThreshold = configRepository.get("cloudWaterThreshold", 1.0);
    humidityChangePct = configRepository.get("humidityChangePct", 1.3);

    evaluate(facts) {
        return !(
            this.exceedsPrecipitationThreshold(facts.priorAccumulation, facts.forecastAccumulation)
        );
    }

    exceedsPrecipitationThreshold(priorAccumulation, forecastAccumulation) {
        return (priorAccumulation + forecastAccumulation) > this.precipitationRateThreshold;
    }
}

module.exports = new RulesService();