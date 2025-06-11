const noaa_gfs = require("noaa-gfs-js");

class GfsPort {
    async getMetric(precision, startDate, startHour, lat, lon, sampleCount, metric, retryWait = 1000, retryWaitMax = 60000) {
        return noaa_gfs.get_gfs_data(precision, startDate, startHour, [lat, lat], [lon, lon], sampleCount, metric, true)
        .then((results) => {
            return results;
        })
        .catch((error) => {
            if(retryWait >= retryWaitMax) throw error;
            console.error(`Error fetching GFS data, retrying in ${retryWait}`);
            return new Promise((resolve) => setTimeout(resolve, retryWait))
            .then(() => {
                console.warn("Retrying GFS data fetch...");
                return this.getMetric(precision, startDate, startHour, lat, lon, sampleCount, metric, retryWait * 2, retryWaitMax);
            });
        });
    }
}

module.exports = new GfsPort();