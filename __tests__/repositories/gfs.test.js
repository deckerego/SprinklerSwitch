const { DateTime, Settings } = require("luxon");
const gfsRepository = require("../../src/repositories/gfs.js");
const gfsPorts = require("../../src/ports/gfs.js");
jest.mock("../../src/ports/gfs.js");

describe("Test GFS date formatting", () => {
  const luxonNow = Settings.now;

  afterEach(() => {
    Settings.now = luxonNow;
  });

  test("Start date of yesterday around noon", () => {
    Settings.now = () => new Date('2025-06-12T12:00:08.000').valueOf();
    const startDate = gfsRepository.getStartDate();
    expect(startDate.dateString).toBe('20250611');
    expect(startDate.hourString).toBe('12');
  });

  test("Start date of yesterday around midnight", () => {
    Settings.now = () => new Date('2025-06-12T00:00:08.000').valueOf();
    const startDate = gfsRepository.getStartDate();
    expect(startDate.dateString).toBe('20250611');
    expect(startDate.hourString).toBe('00');
  });

  test("Start date of yesterday around 2 AM", () => {
    Settings.now = () => new Date('2025-06-12T02:00:08.000').valueOf();
    const startDate = gfsRepository.getStartDate();
    expect(startDate.dateString).toBe('20250611');
    expect(startDate.hourString).toBe('00');
  });
});

describe("Obtain NOAA GFS data", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Fetch a metric", async () => {
    gfsPorts.getMetric.mockImplementation((precision, date, hour, latRange, lonRange, samples, metric, format) => {
      return Promise.resolve(mockAnyData);
    });

    const results = await gfsRepository.getMetric(47.6205099, -122.3518523, 'my_metric');
    // We expect there are going to be count + 1 samples, with the last being ultimately discarded
    expect(results.array_format).toHaveLength((gfsRepository.sampleCount + 1) * 4);
  });

  test("Aggregate a metric", async () => {
    gfsPorts.getMetric.mockImplementation((precision, date, hour, latRange, lonRange, samples, metric, format) => {
      return Promise.resolve(mockAnyData);
    });

    const results = await gfsRepository.getAggregateMetric(47.6205099, -122.3518523, 'my_metric');
    expect(results).toHaveLength(gfsRepository.sampleCount);
    expect(results[10].value).toBe(0.000030000001);
  });

  test("Calculate wind speed", async () => {
    gfsPorts.getMetric.mockImplementation((precision, date, hour, latRange, lonRange, samples, metric, format) => {
      return Promise.resolve(mockAnyData);
    });

    const results = await gfsRepository.getWindSpeed(47.6205099, -122.3518523);
    expect(results).toHaveLength(gfsRepository.sampleCount);
    expect(results[10].value).toBe(Math.sqrt(Math.pow(0.000030000001, 2) + Math.pow(0.000030000001, 2)));
  });
});

const mockAnyData = {
  "array_format": [
    {
      "time": "8/19/2024, 12:00:00 PM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/19/2024, 12:00:00 PM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/19/2024, 12:00:00 PM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/19/2024, 12:00:00 PM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/19/2024, 3:00:00 PM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/19/2024, 3:00:00 PM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/19/2024, 3:00:00 PM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/19/2024, 3:00:00 PM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/19/2024, 6:00:00 PM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/19/2024, 6:00:00 PM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/19/2024, 6:00:00 PM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/19/2024, 6:00:00 PM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/19/2024, 9:00:00 PM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/19/2024, 9:00:00 PM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/19/2024, 9:00:00 PM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/19/2024, 9:00:00 PM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/20/2024, 12:00:00 AM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/20/2024, 12:00:00 AM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/20/2024, 12:00:00 AM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/20/2024, 12:00:00 AM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/20/2024, 3:00:00 AM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/20/2024, 3:00:00 AM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/20/2024, 3:00:00 AM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/20/2024, 3:00:00 AM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/20/2024, 6:00:00 AM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/20/2024, 6:00:00 AM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/20/2024, 6:00:00 AM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/20/2024, 6:00:00 AM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/20/2024, 9:00:00 AM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/20/2024, 9:00:00 AM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/20/2024, 9:00:00 AM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/20/2024, 9:00:00 AM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/20/2024, 12:00:00 PM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/20/2024, 12:00:00 PM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/20/2024, 12:00:00 PM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/20/2024, 12:00:00 PM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/20/2024, 3:00:00 PM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/20/2024, 3:00:00 PM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/20/2024, 3:00:00 PM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0.0000016
    },
    {
      "time": "8/20/2024, 3:00:00 PM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0.000004
    },
    {
      "time": "8/20/2024, 6:00:00 PM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0.0000064
    },
    {
      "time": "8/20/2024, 6:00:00 PM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0.000030000001
    },
    {
      "time": "8/20/2024, 6:00:00 PM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0.0000152
    },
    {
      "time": "8/20/2024, 6:00:00 PM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0.0000852
    },
    {
      "time": "8/20/2024, 9:00:00 PM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0.000026400001
    },
    {
      "time": "8/20/2024, 9:00:00 PM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0.0000128
    },
    {
      "time": "8/20/2024, 9:00:00 PM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 8e-7
    },
    {
      "time": "8/20/2024, 9:00:00 PM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/21/2024, 12:00:00 AM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0.00013680001
    },
    {
      "time": "8/21/2024, 12:00:00 AM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0.0000744
    },
    {
      "time": "8/21/2024, 12:00:00 AM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/21/2024, 12:00:00 AM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/21/2024, 3:00:00 AM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0.0000496
    },
    {
      "time": "8/21/2024, 3:00:00 AM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0.0000504
    },
    {
      "time": "8/21/2024, 3:00:00 AM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/21/2024, 3:00:00 AM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/21/2024, 6:00:00 AM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/21/2024, 6:00:00 AM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/21/2024, 6:00:00 AM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/21/2024, 6:00:00 AM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/21/2024, 9:00:00 AM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/21/2024, 9:00:00 AM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0.0000024
    },
    {
      "time": "8/21/2024, 9:00:00 AM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/21/2024, 9:00:00 AM",
      "lat": 47.75,
      "lon": -122.25,
      "value": 0
    },
    {
      "time": "8/21/2024, 12:00:00 PM",
      "lat": 47.5,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/21/2024, 12:00:00 PM",
      "lat": 47.5,
      "lon": -122.25,
      "value": 0.0000024
    },
    {
      "time": "8/21/2024, 12:00:00 PM",
      "lat": 47.75,
      "lon": -122.5,
      "value": 0
    },
    {
      "time": "8/21/2024, 12:00:00 PM",
      "lat": 47.75,
      "lon": -122.25,
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
    },
    "8/19/2024, 3:00:00 PM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    },
    "8/19/2024, 6:00:00 PM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    },
    "8/19/2024, 9:00:00 PM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    },
    "8/20/2024, 12:00:00 AM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    },
    "8/20/2024, 3:00:00 AM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    },
    "8/20/2024, 6:00:00 AM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    },
    "8/20/2024, 9:00:00 AM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    },
    "8/20/2024, 12:00:00 PM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    },
    "8/20/2024, 3:00:00 PM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0
      },
      "47.75": {
        "-122.5": 0.0000016,
        "-122.25": 0.000004
      }
    },
    "8/20/2024, 6:00:00 PM": {
      "47.5": {
        "-122.5": 0.0000064,
        "-122.25": 0.000030000001
      },
      "47.75": {
        "-122.5": 0.0000152,
        "-122.25": 0.0000852
      }
    },
    "8/20/2024, 9:00:00 PM": {
      "47.5": {
        "-122.5": 0.000026400001,
        "-122.25": 0.0000128
      },
      "47.75": {
        "-122.5": 8e-7,
        "-122.25": 0
      }
    },
    "8/21/2024, 12:00:00 AM": {
      "47.5": {
        "-122.5": 0.00013680001,
        "-122.25": 0.0000744
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    },
    "8/21/2024, 3:00:00 AM": {
      "47.5": {
        "-122.5": 0.0000496,
        "-122.25": 0.0000504
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    },
    "8/21/2024, 6:00:00 AM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    },
    "8/21/2024, 9:00:00 AM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0.0000024
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    },
    "8/21/2024, 12:00:00 PM": {
      "47.5": {
        "-122.5": 0,
        "-122.25": 0.0000024
      },
      "47.75": {
        "-122.5": 0,
        "-122.25": 0
      }
    }
  },
  "times": [
    "8/19/2024, 12:00:00 PM",
    "8/19/2024, 3:00:00 PM",
    "8/19/2024, 6:00:00 PM",
    "8/19/2024, 9:00:00 PM",
    "8/20/2024, 12:00:00 AM",
    "8/20/2024, 3:00:00 AM",
    "8/20/2024, 6:00:00 AM",
    "8/20/2024, 9:00:00 AM",
    "8/20/2024, 12:00:00 PM",
    "8/20/2024, 3:00:00 PM",
    "8/20/2024, 6:00:00 PM",
    "8/20/2024, 9:00:00 PM",
    "8/21/2024, 12:00:00 AM",
    "8/21/2024, 3:00:00 AM",
    "8/21/2024, 6:00:00 AM",
    "8/21/2024, 9:00:00 AM",
    "8/21/2024, 12:00:00 PM"
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