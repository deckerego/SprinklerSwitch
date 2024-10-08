const noaa_gfs = require("noaa-gfs-js");
const haversine = require('haversine-distance');
const DEBUG = process.env.DEBUG ? process.env.DEBUG === 'true' : false;
const TRACE = process.env.TRACE ? process.env.TRACE === 'true' : false;
const consoleLog = console.log;

class GfsRepository {
    precision = '0p25';
    sampleCount = 16;

    async getPrecipitationRate(lat, lon) {
        return await this.getAggregateMetric(lat, lon, 'pratesfc');
    }

    async getPrecipitableWater(lat, lon) {
        return await this.getAggregateMetric(lat, lon, 'pwatclm');
    }

    async getCloudWater(lat, lon) {
        return await this.getAggregateMetric(lat, lon, 'cwatclm');
    }

    async getRelativeHumidity(lat, lon) {
        return await this.getAggregateMetric(lat, lon, 'rhprs');
    }

    async getSpecificHumidity(lat, lon) {
        return await this.getAggregateMetric(lat, lon, 'spfhprs');
    }

    async getGroundTemperature(lat, lon) {
        return await this.getAggregateMetric(lat, lon, 'tmpprs');
    }

    async getWindSpeed(lat, lon) {
        const data = await Promise.all([
            this.getAggregateMetric(lat, lon, 'ugrdprs'),
            this.getAggregateMetric(lat, lon, 'vgrdprs'),
        ]);

        const windUByTime = data[0].reduce((acc, result) => acc.set(result.time.toISOString(), result), new Map());
        const windSpeed = data[1].map((resultV) => {
            const resultU = windUByTime.get(resultV.time.toISOString());
            return {
                ...resultV,
                uValue: resultU.value,
                vValue: resultV.value,
                value: Math.sqrt((resultU.value * resultU.value) + (resultV.value * resultV.value))
            };
        });

        return Array.from(windSpeed.values());
    }

    async getAggregateMetric(lat, lon, metric) {
        const metrics = await this.getMetric(lat, lon, metric);
        if(TRACE) console.trace(metrics.array_format.map(result => `${new Date(result.time).toISOString()},${result.lat},${result.lon},${metric},${result.value}`));

        const aggregateMetrics = GfsRepository.closest(lat, lon, metrics);
        if(DEBUG) console.debug(`Aggregated ${metric} metrics from ${metrics.array_format.length} to ${aggregateMetrics.length} values`);
        if(TRACE) console.trace(aggregateMetrics.map(result => `${new Date(result.time).toISOString()},${metric},${result.duration},${result.value}`));

        return aggregateMetrics;
    }

    async getMetric(lat, lon, metric) {
        const yesterday = GfsRepository.getYesterday();
        if(! DEBUG) console.log = (message) => { /* Mute console logging from the NOAA GFS library */ };
        const result = await noaa_gfs.get_gfs_data(this.precision, yesterday.dateString, yesterday.hourString, [lat, lat], [lon, lon], this.sampleCount, metric, true);
        console.log = consoleLog;
        return result;
    }

    static getYesterday() {
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);
        const year = String(yesterday.getFullYear());
        const month = String(yesterday.getMonth() + 1).padStart(2, '0');
        const date = String(yesterday.getDate()).padStart(2, '0');
        const hour = String(yesterday.getHours() - (yesterday.getHours() % 6)).padStart(2, '0');
        return {
            dateString: year + month + date,
            hourString: hour
        };
    }

    static closest(lat, lon, metrics) {
        const aggregate = metrics.array_format.reduce((acc, result) => {
            const resultTime = new Date(result.time);
            const resultDistance = haversine([lat, lon], [result.lat, result.lon]);

            if (acc.has(result.time)) {
                const previousResult = acc.get(result.time);
                if(previousResult.distance > resultDistance) {
                    acc.set(result.time, {
                        time: resultTime,
                        latitude: result.lat,
                        longitude: result.lon,
                        distance: resultDistance,
                        value: result.value
                    });
                }
            } else {
                acc.set(result.time, {
                    time: resultTime,
                    latitude: result.lat,
                    longitude: result.lon,
                    distance: resultDistance,
                    value: result.value
                });
            }
            return acc;
        }, new Map());

        const enriched = Array.from(aggregate.values()).map((result, i, results) => {
            const resultDuration = i < results.length - 1 ? (new Date(results[i+1].time) - result.time) / 1000 : undefined;
            return { ...result, duration: resultDuration }; 
        });

        // Don't return the last element, it was just there for duration calcuations.
        return enriched.slice(0, -1); 
    }
}

module.exports = new GfsRepository();