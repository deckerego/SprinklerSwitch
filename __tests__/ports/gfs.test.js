const gfsPort = require("../../src/ports/gfs.js");
const noaa_gfs = require("noaa-gfs-js");
jest.mock("noaa-gfs-js");

describe("Obtain NOAA GFS data", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Fetch a metric", async () => {
    noaa_gfs.get_gfs_data.mockImplementation((precision, date, hour, latRange, lonRange, samples, metric, format) => {
      expect(format).toBe(true);
      expect(latRange).toEqual([47.6205099, 47.6205099]);
      expect(lonRange).toEqual([-122.3518523, -122.3518523]);
      return Promise.resolve(mockAnyData);
    });

    const results = await gfsPort.getMetric('0p25', '20250501', '06', 47.6205099, -122.3518523, 16, 'my_metric');
    expect(results.array_format).toHaveLength(1);
  });
});

const mockAnyData = {
  "array_format": [
    {
      "time": "8/19/2024, 12:00:00 PM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    }
  ],
  "obj_format": {
    "8/19/2024, 12:00:00 PM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    }
  },
  "times": [
    "8/19/2024, 12:00:00 PM"
  ],
  "lats": [
    47.5,
    47.75
  ],
  "lons": [
    -122.5,
    -122.25
  ],
  "levs": [],
  "url": "https://nomads.ncep.noaa.gov/dods/gfs_0p25/gfs20240819/gfs_0p25_12z.ascii?pratesfc[0:17][550:551][950:951]"
};