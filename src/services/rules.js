const configRepository = require("../repositories/config.js");

class RulesService {
    precipitationRateThreshold = configRepository.get("precipitationRateThreshold", 5.0);
    precipitableWaterThreshold = configRepository.get("precipitableWaterThreshold", 50.0);
    cloudWaterThreshold = configRepository.get("cloudWaterThreshold", 1.0);
    humidityChangePct = configRepository.get("humidityChangePct", 1.5);

    evaluate(facts) {
        return !(
            this.exceedsPrecipitationThreshold(facts.priorAccumulation, facts.forecastAccumulation) &&
            (
                this.exceedsWaterThreshold(facts.maxPrecipitable, facts.maxCloudWater) ||
                this.humiditySpike(facts.priorSpecificHumidity, facts.forecastSpecificHumidity)
            )
        );
    }

    exceedsWaterThreshold(preciptable, cloudWater) {
        return (preciptable > this.precipitableWaterThreshold) || (cloudWater > this.cloudWaterThreshold);
    }

    exceedsPrecipitationThreshold(priorAccumulation, forecastAccumulation) {
        return (priorAccumulation + forecastAccumulation) > this.precipitationRateThreshold;
    }

    humiditySpike(priorSpecificHumidity, forecastSpecificHumidity) {
        return (forecastSpecificHumidity / priorSpecificHumidity) > this.humidityChangePct;
    }
}

module.exports = new RulesService();