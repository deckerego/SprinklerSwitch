const rulesService = require("../../src/services/rules.js");
const configRepository = require("../../src/repositories/config.js");
jest.mock("../../src/repositories/config.js");

configRepository.get.mockImplementation((key) => {
  switch (key) {
    case 'precipitationRateThreshold': return 0.001;
    case 'precipitableWaterThreshold': return 50.0;
  };
});

describe("Precipitation rate", () => {
  test("Too much rain yesterday", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: 0.002,
      forecastAccumulation: 0.0,
      maxPrecipitable: Number.MAX_SAFE_INTEGER
    });
    expect(result).toBe(false);
  });

  test("Too much rain today", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: 0.0,
      forecastAccumulation: 0.002,
      maxPrecipitable: Number.MAX_SAFE_INTEGER
    });
    expect(result).toBe(false);
  });

  test("Too much rain total", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: 0.0006,
      forecastAccumulation: 0.0005,
      maxPrecipitable: Number.MAX_SAFE_INTEGER
    });
    expect(result).toBe(false);
  });

  test("Too little rain total", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: 0.0006,
      forecastAccumulation: 0.0,
      maxPrecipitable: Number.MAX_SAFE_INTEGER
    });
    expect(result).toBe(true);
  });
});

describe("Precipitable water", () => {
  test("Heavy clouds", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: Number.MAX_SAFE_INTEGER,
      forecastAccumulation: Number.MAX_SAFE_INTEGER,
      maxPrecipitable: 51.0
    });
    expect(result).toBe(false);
  });

  test("No clouds", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: Number.MAX_SAFE_INTEGER,
      forecastAccumulation: Number.MAX_SAFE_INTEGER,
      maxPrecipitable: 0.0
    });
    expect(result).toBe(true);
  });
});
