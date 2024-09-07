const configRepository = require("../../src/repositories/config.js");
jest.mock("../../src/repositories/config.js");

describe("Precipitation rate", () => {
  beforeAll(() => {
    configRepository.get.mockImplementation((key, fallback) => {
      switch (key) {
        default: return fallback;
      };
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
  
  test("Too much rain", async () => {
    const rulesService = require("../../src/services/rules.js");
    const result = rulesService.exceedsPrecipitationThreshold({
      priorAccumulation: 1.0,
      forecastAccumulation: 0.5,
      forecastEvaporationRate: 1.25
    });
    expect(result).toBe(true);
  });

  test("Too little rain", async () => {
    const rulesService = require("../../src/services/rules.js");
    const result = rulesService.exceedsPrecipitationThreshold({
      priorAccumulation: 0.0,
      forecastAccumulation: 0.5,
      forecastEvaporationRate: 1.25
    });
    expect(result).toBe(false);
  });
});

describe("Atmosphere conditions", () => {
  beforeAll(() => {
    configRepository.get.mockImplementation((key, fallback) => {
      switch (key) {
        case 'precipitableWaterThreshold': return 50.0;
        case 'cloudWaterThreshold': return 1.0;
        default: return fallback;
      };
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
  
  test("Ready to rain", async () => {
    const rulesService = require("../../src/services/rules.js");
    const result = rulesService.exceedsWaterThreshold({
      maxPrecipitable: 51.0,
      maxCloudWater: 0.0,
    });
    expect(result).toBe(true);
  });

  test("Dry water column", async () => {
    const rulesService = require("../../src/services/rules.js");
    const result = rulesService.exceedsWaterThreshold({
      maxPrecipitable: 10.0,
      maxCloudWater: 0.0,
    });
    expect(result).toBe(false);
  });

  test("Heavy clouds", async () => {
    const rulesService = require("../../src/services/rules.js");
    const result = rulesService.exceedsWaterThreshold({
      maxPrecipitable: 0.0,
      maxCloudWater: 1.1,
    });
    expect(result).toBe(true);
  });


  test("No clouds", async () => {
    const rulesService = require("../../src/services/rules.js");
    const result = rulesService.exceedsWaterThreshold({
      maxPrecipitable: 0.0,
      maxCloudWater: 0.1,
    });
    expect(result).toBe(false);
  });
});