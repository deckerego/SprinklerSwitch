const configRepository = require("../../src/repositories/config.js");
const fs = require('node:fs');
jest.mock("node:fs");

describe("Retrieve configuration settings", () => {
  const OLD_ENV = process.env;
  
  beforeEach(() => {
    jest.clearAllMocks();
    configRepository.config = undefined;
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("Fetch a key by environment variable", async () => {
    fs.readFileSync.mockImplementation((path, encoding) => mockConfig);
    process.env.LATITUDE = '2.5'; // Can only be a string
    const value = configRepository.get("latitude", "FAIL");
    expect(value).toBe(2.5);
  });

  test("Fetch a key by config file", async () => {
    fs.readFileSync.mockImplementation((path, encoding) => mockConfig);
    process.env.LATITUDE = undefined;
    const value = configRepository.get("latitude", "FAIL");
    expect(value).toBe(47.6205099);
  });

  test("Fetch a key by fallback value", async () => {
    fs.readFileSync.mockImplementation((path, encoding) => '{}');
    process.env.LATITUDE = undefined;
    const value = configRepository.get("latitude", 1.0);
    expect(value).toBe(1.0);
  });
})

describe("Failure states", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    configRepository.config = undefined;
  });

  test("File is not found", async () => {
    fs.readFileSync.mockImplementation((path, encoding) => { throw new Error("Bad File");});
    expect(() => configRepository.get("latitude", 1.0)).toThrow("Bad File");
  });

  test("Key is not a string", async () => {
    fs.readFileSync.mockImplementation((path, encoding) => '{}');
    expect(() => configRepository.get(0.0, 1.0)).toThrow(TypeError);
  });
})

const mockConfig = '{ \
  "latitude": 47.6205099, \
  "longitude": -122.3518523, \
  "gpioDeviceId": 535, \
  "precipitationRateThreshold": 0.001 \
}'