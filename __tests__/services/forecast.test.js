const forecastService = require("../../src/services/forecast.js");
const gfsRepository = require("../../src/repositories/gfs.js");
jest.mock("../../src/repositories/gfs.js");
const configRepository = require("../../src/repositories/config.js");
jest.mock("../../src/repositories/config.js");

gfsRepository.getPrecipitationRate.mockImplementation((lat, lon, metric) =>  Promise.resolve(mockPrecipitationRateData));
gfsRepository.getPrecipitableWater.mockImplementation((lat, lon, metric) =>  Promise.resolve(mockPrecipitableWaterData));

describe("Precipitation rate", () => {
  test("Too much rain", async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-08-20T13:30:00.000Z'));

    configRepository.get.mockImplementation((key) => {
      switch (key) {
        case 'latitude': return 47.6205099;
        case 'longitude': return -122.3518523;
        case 'precipitationRateThreshold': return 0.0002;
        case 'precipitableWaterThreshold': return 0.0;
      };
    });

    const result = await forecastService.shouldIrrigate();
    expect(result).toBe(false);
  });

  test("Too little rain", async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-08-20T13:30:00.000Z'));

    configRepository.get.mockImplementation((key) => {
      switch (key) {
        case 'latitude': return 47.6205099;
        case 'longitude': return -122.3518523;
        case 'precipitationRateThreshold': return 0.0003;
        case 'precipitableWaterThreshold': return Number.MAX_SAFE_INTEGER;
      };
    });

    const result = await forecastService.shouldIrrigate();
    expect(result).toBe(true);
  });
})

describe("Precipitable water", () => {
  test("Heavy clouds", async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-08-20T13:30:00.000Z'));

    configRepository.get.mockImplementation((key) => {
      switch (key) {
        case 'latitude': return 47.6205099;
        case 'longitude': return -122.3518523;
        case 'precipitationRateThreshold': return 0.0;
        case 'precipitableWaterThreshold': return 50.0;
      };
    });

    const result = await forecastService.shouldIrrigate();
    expect(result).toBe(false);
  });

  test("No clouds", async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-08-20T13:30:00.000Z'));

    configRepository.get.mockImplementation((key) => {
      switch (key) {
        case 'latitude': return 47.6205099;
        case 'longitude': return -122.3518523;
        case 'precipitationRateThreshold': return Number.MAX_SAFE_INTEGER;
        case 'precipitableWaterThreshold': return 46.0;
      };
    });

    const result = await forecastService.shouldIrrigate();
    expect(result).toBe(true);
  });
})

const mockPrecipitationRateData = [
  {
    "time": new Date("2024-08-19T16:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-19T19:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-19T22:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T01:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T04:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T07:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T10:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T13:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T16:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T19:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0.000002940067597816433
  },
  {
    "time": new Date("2024-08-20T22:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0.00007464068029076087
  },
  {
    "time": new Date("2024-08-21T01:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0.00001905282479447121
  },
  {
    "time": new Date("2024-08-21T04:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0.00010161692339361316
  },
  {
    "time": new Date("2024-08-21T07:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0.00005031439416219344
  },
  {
    "time": new Date("2024-08-21T10:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-21T13:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0.0000013801752054913108
  }
];

const mockPrecipitableWaterData = [
  {
    "time": new Date("2024-08-19T16:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-19T19:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-19T22:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T01:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T04:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T07:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T10:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T13:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T16:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-20T19:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 40.0
  },
  {
    "time": new Date("2024-08-20T22:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 45.5
  },
  {
    "time": new Date("2024-08-21T01:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 30.5
  },
  {
    "time": new Date("2024-08-21T04:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 10.5
  },
  {
    "time": new Date("2024-08-21T07:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-21T10:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  },
  {
    "time": new Date("2024-08-21T13:00:00.000Z"),
    "latitude": 47.75,
    "longitude": -122.25,
    "value": 0
  }
];