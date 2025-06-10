const noaa_gfs = require("noaa-gfs-js");

class GfsPort {
    async getMetric(precision, startDate, startHour, lat, lon, sampleCount, metric) {
        return await noaa_gfs.get_gfs_data(precision, startDate, startHour, [lat, lat], [lon, lon], sampleCount, metric, true);
    }
}

module.exports = new GfsPort();