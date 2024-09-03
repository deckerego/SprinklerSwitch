const noaa_gfs = require("noaa-gfs-js");
const haversine = require('haversine-distance');
const DEBUG = process.env.DEBUG ? process.env.DEBUG === 'true' : false;
const TRACE = process.env.TRACE ? process.env.TRACE === 'true' : false;
const consoleLog = console.log;

class GfsRepository {
    precision = '0p25';
    sampleCount = 16;
    secondsPerInterval = 60 * 60 * 3; //Assume each GIS interval is three hours

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
        return await this.getAggregateMetric(lat, lon, 'rh30_0mb');
    }

    async getGroundTemperature(lat, lon) {
        return await this.getAggregateMetric(lat, lon, 'tmp30_0mb');
    }

    async getAggregateMetric(lat, lon, metric) {
        const metrics = await this.getMetric(lat, lon, metric);
        if(DEBUG) console.debug(`Fetched ${metrics.array_format.length} ${metric} results from NOAA`);
        if(TRACE) console.trace(metrics.array_format.map(result => `${new Date(result.time).toISOString()},${result.lat},${result.lon},${metric},${result.value}`));

        const aggregateMetrics = GfsRepository.closest(lat, lon, metrics);
        if(DEBUG) console.debug(`Aggregated ${aggregateMetrics.length} ${metric} values`);
        if(TRACE) console.trace(aggregateMetrics.map(result => `${new Date(result.time).toISOString()},${metric},${result.value}`));

        return aggregateMetrics;
    }

    async getMetric(lat, lon, metric) {
        const yesterday = GfsRepository.getYesterday();
        if(! TRACE) console.log = (message) => { /* Mute console logging from the NOAA GFS library */ };
        const result = await noaa_gfs.get_gfs_data(this.precision, yesterday.dateString, yesterday.hourString, [lat, lat], [lon, lon], this.sampleCount - 1, metric, true);
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

    static closest(lat, lon, results) {
        const aggregate = results.array_format.reduce((acc, result) => {
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

        return Array.from(aggregate.values());
    }
}

module.exports = new GfsRepository();