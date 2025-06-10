const gfsPort = require("../ports/gfs");
const haversine = require('haversine-distance');
const { DateTime } = require("luxon");
const DEBUG = process.env.DEBUG ? process.env.DEBUG === 'true' : false;
const TRACE = process.env.TRACE ? process.env.TRACE === 'true' : false;
const consoleLog = console.log;

class GfsRepository {
    constructor() {
        this.precision     = '0p25'; // Resolution of our geolocated metrics
        this.durationHours = 3;      // Duration of a given metric value (e.g. a three hour sample)
        this.previousDays  = 1;      // Number of prior days to query for metrics
        this.futureDays    = 1;      // Number of days in the future to forecast metrics
        // Number of forward-marching increments by duration
        this.sampleCount   = ((this.previousDays + this.futureDays) * 24) / this.durationHours;
    }

    /** surface total precipitation [kg/m^2] */
    async getPrecipitationRate(lat, lon) {
        //TODO The apcpsfc would be a better fit; currently not supported in noaa-gfs-js
        return await this.getAggregateMetric(lat, lon, 'pratesfc');
    }

    /** entire atmosphere (considered as a single layer) precipitable water [kg/m^2] */
    async getPrecipitableWater(lat, lon) {
        return await this.getAggregateMetric(lat, lon, 'pwatclm');
    }

    /** entire atmosphere (considered as a single layer) cloud water [kg/m^2] */
    async getCloudWater(lat, lon) {
        return await this.getAggregateMetric(lat, lon, 'cwatclm');
    }

    /** relative humidity [%] */
    async getRelativeHumidity(lat, lon) {
        return await this.getAggregateMetric(lat, lon, 'rhprs');
    }

    /** specific humidity [kg/kg] */
    async getSpecificHumidity(lat, lon) {
        return await this.getAggregateMetric(lat, lon, 'spfhprs');
    }

    /** temperature [k] */
    async getGroundTemperature(lat, lon) {
        return await this.getAggregateMetric(lat, lon, 'tmpprs');
    }

    /** composite of u and v components of wind [m/s] */
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

    /**
     * Find the closest values for a given metric
     * @param {*} lat The latitude you want values for
     * @param {*} lon The longitude you want values for
     * @param {*} metric The NOAA GFS Data Field name
     * @returns A list of datestamped values for the given metric
     */
    async getAggregateMetric(lat, lon, metric) {
        const metrics = await this.getMetric(lat, lon, metric);
        if(TRACE) console.trace(metrics.array_format.map(result => `${new Date(result.time).toISOString()},${result.lat},${result.lon},${metric},${result.value}`));

        const aggregateMetrics = GfsRepository.closest(lat, lon, metrics);
        if(DEBUG) console.debug(`Aggregated ${metric} metrics from ${metrics.array_format.length} to ${aggregateMetrics.length} values`);
        if(TRACE) console.trace(aggregateMetrics.map(result => `${new Date(result.time).toISOString()},${metric},${result.duration},${result.value}`));

        return aggregateMetrics;
    }

    /**
     * Get a raw list of noaa-gfs-js metrics
     * @param {*} lat The latitude you want values for
     * @param {*} lon The longitude you want values for
     * @param {*} metric The NOAA GFS Data Field name
     * @returns A list of datestamped values across relevant locations for the given metric
     */
    async getMetric(lat, lon, metric) {
        const startDate = this.getStartDate();
        if(DEBUG) console.debug(`Fetching ${metric} at ${this.precision} starting ${startDate.dateString} over ${this.sampleCount} samples`);
        if(! DEBUG) console.log = (message) => { /* Mute console logging from the NOAA GFS library */ };
        const result = await gfsPort.getMetric(this.precision, startDate.dateString, startDate.hourString, lat, lon, this.sampleCount, metric);
        console.log = consoleLog;
        return result;
    }

    /**
     * Provide yesterday as a JSON object that can be parsed by noaa-gfs-js
     * @returns A JSON object with a dateString in YYYMMDD format and an 
     * hourString in 24-hour format that is the current time in 6 hour increments
     */
    getStartDate() {
        const startDate = DateTime.local().minus({ days: this.previousDays });
        const hour = String(startDate.get('hour') - (startDate.get('hour') % 6)).padStart(2, '0');
        return {
            dateString: startDate.toFormat('yyyyMMdd'),
            hourString: hour
        };
    }

    /**
     * Given a list of values for a metric, consolidate each timestamp+value to contain only 
     * those entries that are geographically closest to a given latitude/longitude
     * @param {*} lat The latitude you want values for
     * @param {*} lon The longitude you want values for
     * @param {*} metrics The list of values, where each timestamp has one or more location
     * @returns An aggregated list of values, where each timestamp only has one location
     */
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