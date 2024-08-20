const noaa_gfs = require("noaa-gfs-js");
const haversine = require('haversine-distance');
const DEBUG = process.env.DEBUG ? process.env.DEBUG === 'true' : false;

class GfsRepository {
    precision = '0p25';

    async getPrecipitationRate(lat, lon) {
        return await getAggregateMetric(lat, lon, 'pratesfc');
    }

    async getPrecipitableWater(lat, lon) {
        return await getAggregateMetric(lat, lon, 'pwatclm');
    }

    async getCloudWater(lat, lon) {
        return await getAggregateMetric(lat, lon, 'cwatclm');
    }

    async getRelativeHumidity(lat, lon) {
        return await getAggregateMetric(lat, lon, 'rh30_0mb');
    }

    async getGroundTemperature(lat, lon) {
        return await getAggregateMetric(lat, lon, 'tmp30_0mb');
    }

    async getMetric(lat, lon, metric) {
        const yesterday = getYesterday();
        return await noaa_gfs.get_gfs_data(precision, yesterday.dateString, yesterday.hourString, [lat, lat], [lon, lon], 16, metric, true);
    }

    getYesterday() {
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

    async getAggregateMetric(lat, lon, metric) {
        const metrics = await getMetric(lat, lon, metric);
        console.debug(`Fetched ${metrics.array_format.length} ${metric} results from NOAA`);
        if (DEBUG) console.debug(metrics.array_format.map(result => `${new Date(result.time).toISOString()},${result.lat},${result.lon},${metric},${result.value}`));

        const aggregateMetrics = aggregate(lat, lon, metrics);
        console.debug(`Aggregated ${aggregateMetrics.length} ${metric} values`);
        if (DEBUG) console.debug(aggregateMetrics.map(result => `${new Date(result.time).toISOString()},${metric},${result.value}`));

        return aggregateMetrics;
    }

    aggregate(lat, lon, results) {
        const maxDistance = haversine([results.lats[0], results.lats[1]], [results.lons[0], results.lons[1]]);

        const aggregate = results.array_format.reduce((acc, result) => {
            const resultTime = new Date(result.time);
            const distance = haversine([lat, lon], [result.lat, result.lon]);
            const magnitude = 1 - (distance / maxDistance);
            const weightedValue = magnitude * result.value;

            if (acc.has(result.time)) {
                const avgResult = acc.get(result.time);
                acc.set(result.time, {
                    time: resultTime,
                    value: Math.max(weightedValue, avgResult.value)
                });
            } else {
                acc.set(result.time, {
                    time: resultTime,
                    value: weightedValue
                });
            }
            return acc;
        }, new Map());

        return Array.from(aggregate.values());
    }
}

module.exports = new GfsRepository();