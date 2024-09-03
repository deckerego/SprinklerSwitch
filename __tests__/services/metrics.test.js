const metricsService = require("../../src/services/metrics.js");
const gfsRepository = require("../../src/repositories/gfs.js");
jest.mock("../../src/repositories/gfs.js");
const configRepository = require("../../src/repositories/config.js");
jest.mock("../../src/repositories/config.js");

gfsRepository.getPrecipitationRate.mockImplementation((lat, lon, metric) =>  Promise.resolve(mockPrecipitationRateData));
gfsRepository.getPrecipitableWater.mockImplementation((lat, lon, metric) =>  Promise.resolve(mockPrecipitableWaterData));
configRepository.get.mockImplementation((key) => {
  switch (key) {
    case 'latitude': return 47.6205099;
    case 'longitude': return -122.3518523;
  };
});

describe("Get forecast metrics", () => {
  test("Precipitation rate", async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-08-20T13:30:00.000Z'));
    const result = await metricsService.fetch();
    expect(result.priorAccumulation).toBe(0.0);
    expect(result.forecastAccumulation).toBe(2.6994067067989413);
  });

  test("Precipitable water", async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-08-20T13:30:00.000Z'));
    const result = await metricsService.fetch();
    expect(result.maxPrecipitable).toBe(45.5);
  });
});

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