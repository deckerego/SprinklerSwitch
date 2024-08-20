const forecastService = require("../../src/services/forecast.js");
const gfsRepository = require("../../src/repositories/gfs.js");
jest.mock("../../src/repositories/gfs.js");
const configRepository = require("../../src/repositories/config.js");
jest.mock("../../src/repositories/config.js");

describe("Determine irrigation need", () => {
  test("Too much rain", async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-08-20T13:30:00.000Z'));

    configRepository.get.mockImplementation((key) => {
      switch (key) {
        case 'latitude': return 47.6205099;
        case 'longitude': return -122.3518523;
        case 'precipitationRateThreshold': return 0.0002;
      };
    });

    gfsRepository.getPrecipitationRate.mockImplementation((lat, lon, metric) => {
      return Promise.resolve(mockAnyData);
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
      };
    });

    gfsRepository.getPrecipitationRate.mockImplementation((lat, lon, metric) => {
      return Promise.resolve(mockAnyData);
    });

    const result = await forecastService.shouldIrrigate();
    expect(result).toBe(true);
  });
})

const mockAnyData = [
  {
    "time": new Date("2024-08-19T16:00:00.000Z"),
    "value": 0
  },
  {
    "time": new Date("2024-08-19T19:00:00.000Z"),
    "value": 0
  },
  {
    "time": new Date("2024-08-19T22:00:00.000Z"),
    "value": 0
  },
  {
    "time": new Date("2024-08-20T01:00:00.000Z"),
    "value": 0
  },
  {
    "time": new Date("2024-08-20T04:00:00.000Z"),
    "value": 0
  },
  {
    "time": new Date("2024-08-20T07:00:00.000Z"),
    "value": 0
  },
  {
    "time": new Date("2024-08-20T10:00:00.000Z"),
    "value": 0
  },
  {
    "time": new Date("2024-08-20T13:00:00.000Z"),
    "value": 0
  },
  {
    "time": new Date("2024-08-20T16:00:00.000Z"),
    "value": 0
  },
  {
    "time": new Date("2024-08-20T19:00:00.000Z"),
    "value": 0.000002940067597816433
  },
  {
    "time": new Date("2024-08-20T22:00:00.000Z"),
    "value": 0.00007464068029076087
  },
  {
    "time": new Date("2024-08-21T01:00:00.000Z"),
    "value": 0.00001905282479447121
  },
  {
    "time": new Date("2024-08-21T04:00:00.000Z"),
    "value": 0.00010161692339361316
  },
  {
    "time": new Date("2024-08-21T07:00:00.000Z"),
    "value": 0.00005031439416219344
  },
  {
    "time": new Date("2024-08-21T10:00:00.000Z"),
    "value": 0
  },
  {
    "time": new Date("2024-08-21T13:00:00.000Z"),
    "value": 0.0000013801752054913108
  }
];