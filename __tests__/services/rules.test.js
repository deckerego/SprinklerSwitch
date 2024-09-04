const configRepository = require("../../src/repositories/config.js");
jest.mock("../../src/repositories/config.js");
configRepository.get.mockImplementation((key, fallback) => {
  switch (key) {
    case 'precipitationRateThreshold': return 10.0;
    case 'precipitableWaterThreshold': return 50.0;
    case 'cloudWaterThreshold': return 1.0;
    default: return fallback;
  };
});

const rulesService = require("../../src/services/rules.js");

describe("Precipitation rate", () => {
  test("Too much rain yesterday", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: 10.5,
      forecastAccumulation: 0.0,
      maxPrecipitable: Number.MAX_SAFE_INTEGER,
      maxCloudWater: Number.MAX_SAFE_INTEGER
    });
    expect(result).toBe(false);
  });

  test("Too much rain today", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: 0.0,
      forecastAccumulation: 10.5,
      maxPrecipitable: Number.MAX_SAFE_INTEGER,
      maxCloudWater: Number.MAX_SAFE_INTEGER
    });
    expect(result).toBe(false);
  });

  test("Too much rain total", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: 5.5,
      forecastAccumulation: 5.5,
      maxPrecipitable: Number.MAX_SAFE_INTEGER,
      maxCloudWater: Number.MAX_SAFE_INTEGER
    });
    expect(result).toBe(false);
  });

  test("Too little rain total", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: 1.0,
      forecastAccumulation: 1.0,
      maxPrecipitable: Number.MAX_SAFE_INTEGER,
      maxCloudWater: Number.MAX_SAFE_INTEGER
    });
    expect(result).toBe(true);
  });
});

describe("Precipitable water", () => {
  test("High water volume", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: Number.MAX_SAFE_INTEGER,
      forecastAccumulation: Number.MAX_SAFE_INTEGER,
      maxPrecipitable: 51.0,
      maxCloudWater: 0.0
    });
    expect(result).toBe(false);
  });

  test("No water volume", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: Number.MAX_SAFE_INTEGER,
      forecastAccumulation: Number.MAX_SAFE_INTEGER,
      maxPrecipitable: 0.0,
      maxCloudWater: 0.0
    });
    expect(result).toBe(true);
  });

  test("Heavy clouds", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: Number.MAX_SAFE_INTEGER,
      forecastAccumulation: Number.MAX_SAFE_INTEGER,
      maxPrecipitable: 0.0,
      maxCloudWater: 1.5
    });
    expect(result).toBe(false);
  });
});
