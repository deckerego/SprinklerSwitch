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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test("Too much rain yesterday", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: 10.5,
      forecastAccumulation: 0.0,
      maxPrecipitable: Number.MAX_SAFE_INTEGER,
      maxCloudWater: Number.MAX_SAFE_INTEGER,
      priorSpecificHumidity: Number.MAX_SAFE_INTEGER,
      forecastSpecificHumidity: Number.MAX_SAFE_INTEGER,
    });
    expect(result).toBe(false);
  });

  test("Too much rain today", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: 0.0,
      forecastAccumulation: 10.5,
      maxPrecipitable: Number.MAX_SAFE_INTEGER,
      maxCloudWater: Number.MAX_SAFE_INTEGER,
      priorSpecificHumidity: Number.MAX_SAFE_INTEGER,
      forecastSpecificHumidity: Number.MAX_SAFE_INTEGER,
    });
    expect(result).toBe(false);
  });

  test("Too much rain total", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: 5.5,
      forecastAccumulation: 5.5,
      maxPrecipitable: Number.MAX_SAFE_INTEGER,
      maxCloudWater: Number.MAX_SAFE_INTEGER,
      priorSpecificHumidity: Number.MAX_SAFE_INTEGER,
      forecastSpecificHumidity: Number.MAX_SAFE_INTEGER,
    });
    expect(result).toBe(false);
  });

  test("Too little rain total", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: 1.0,
      forecastAccumulation: 1.0,
      maxPrecipitable: Number.MAX_SAFE_INTEGER,
      maxCloudWater: Number.MAX_SAFE_INTEGER,
      priorSpecificHumidity: Number.MAX_SAFE_INTEGER,
      forecastSpecificHumidity: Number.MAX_SAFE_INTEGER,
    });
    expect(result).toBe(true);
  });
});

describe("Cloud water", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test("Heavy Clouds", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: Number.MAX_SAFE_INTEGER,
      forecastAccumulation: Number.MAX_SAFE_INTEGER,
      maxPrecipitable: Number.MAX_SAFE_INTEGER,
      maxCloudWater: Number.MAX_SAFE_INTEGER,
      priorSpecificHumidity: 0.0,
      forecastSpecificHumidity: 0.0,
    });
    expect(result).toBe(false);
  });

  test("No Clouds", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: Number.MAX_SAFE_INTEGER,
      forecastAccumulation: Number.MAX_SAFE_INTEGER,
      maxPrecipitable: 0.0,
      maxCloudWater: 0.0,
      priorSpecificHumidity: 0.0,
      forecastSpecificHumidity: 0.0,
    });
    expect(result).toBe(true);
  });

  test("Only clouds", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: Number.MAX_SAFE_INTEGER,
      forecastAccumulation: Number.MAX_SAFE_INTEGER,
      maxPrecipitable: 0.0,
      maxCloudWater: Number.MAX_SAFE_INTEGER,
      priorSpecificHumidity: 0.0,
      forecastSpecificHumidity: 0.0,
    });
    expect(result).toBe(false);
  });

  test("Preciptable", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: Number.MAX_SAFE_INTEGER,
      forecastAccumulation: Number.MAX_SAFE_INTEGER,
      maxPrecipitable: Number.MAX_SAFE_INTEGER,
      maxCloudWater: 0.0,
      priorSpecificHumidity: 0.0,
      forecastSpecificHumidity: 0.0,
    });
    expect(result).toBe(false);
  });
});

describe("Humidity", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test("Humidity spike", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: Number.MAX_SAFE_INTEGER,
      forecastAccumulation: Number.MAX_SAFE_INTEGER,
      maxPrecipitable:0.0,
      maxCloudWater: 0.0,
      priorSpecificHumidity: 1.0,
      forecastSpecificHumidity: 2.0,
    });
    expect(result).toBe(false);
  });

  test("Stable humidity", async () => {
    const result = await rulesService.evaluate({
      priorAccumulation: Number.MAX_SAFE_INTEGER,
      forecastAccumulation: Number.MAX_SAFE_INTEGER,
      maxPrecipitable: 0.0,
      maxCloudWater: 0.0,
      priorSpecificHumidity: 1.0,
      forecastSpecificHumidity: 1.0,
    });
    expect(result).toBe(true);
  });
});