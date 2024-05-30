import { afterAll, describe, expect, it } from "vitest";
import { validateSensorData } from "../src/utils/requestValidatior";
import { deleteFile, truncateFile } from "../src/services/fileIOService";

describe("Validation Tests", () => {
  let dataFilePath = "./data.test.json";

  afterAll(async () => {
    await deleteFile(dataFilePath);
  });

  it("should validate if sensorId is missing", async () => {
    let validated = await validateSensorData("", "Temperature", 2, "2024-11-11 11:11:11", dataFilePath);
    expect(validated).toEqual("Sensor ID is required and must be a number");
  });

  it("should validate if sensorId is not a number", async () => {
    let validated = await validateSensorData("abc", "Temperature", 2, "2024-11-11 11:11:11", dataFilePath);
    expect(validated).toEqual("Sensor ID is required and must be a number");
  });

  it("should validate if type is missing", async () => {
    let validated = await validateSensorData(32, "", 2, "2024-11-11 11:11:11", dataFilePath);
    expect(validated).toEqual("Type is required");
  });

  it("should validate if value is missing", async () => {
    let validated = await validateSensorData(1000, "Pressure", undefined, "2024-11-11 11:11:11", dataFilePath);
    expect(validated).toEqual("Value is required and must be a number");
  });

  it("should validate if value is not a number", async () => {
    let validated = await validateSensorData(1000, "Pressure", "abc", "2024-11-11 11:11:11", dataFilePath);
    expect(validated).toEqual("Value is required and must be a number");
  });

  it("should validate if timestamp is missing", async () => {
    let validated = await validateSensorData(1000, "Pressure", 2, "", dataFilePath);
    expect(validated).toEqual("Timestamp is required");
  });

  it("should validate if timestamp is not in a valid format", async () => {
    await truncateFile(dataFilePath);
    let validated = await validateSensorData(1000, "Pressure", 2, "01/02/2024 11:43:22", dataFilePath);
    expect(validated).toEqual("Invalid timestamp format. Please use the format YYYY-MM-DD H:i:s");
  });
});
