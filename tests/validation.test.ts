import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { validateSensorData } from "../src/utils/requestValidatior";
import { sensorService } from "../src/services/sensorService";
import { deleteFile, truncateFile } from "../src/services/fileIOService";

describe("Validation Tests", () => {
  let dataFilePath = "./data.test.json";

  afterAll(async() => {
    vi.resetModules()
  })

  it("should validate if sensorId is missing", async () => {
    let validated = await validateSensorData(
      "",
      "Temprature",
      2,
      "2024-11-11 11:11:11"
    );
    expect(validated).toEqual("Sensor ID is required and must be a number");
  });

  it("should validate if sensorId is not a number", async () => {
    let validated = await validateSensorData(
 "abc",
      "Temprature",
      2,
      "2024-11-11 11:11:11"
    );
    expect(validated).toEqual("Sensor ID is required and must be a number");
  });


  it("should validate if type is missing", async () => {
    let validated = await validateSensorData(32, "", 2, "2024-11-11 11:11:11");
    expect(validated).toEqual("Type is required");
  });



  it("should validate if value is missing", async () => {
    let validated = await validateSensorData(
      1000,
      "Pressure",
      undefined,
      "2024-11-11 11:11:11"
    );
    expect(validated).toEqual("Value is required and must be a number");
  });

  it("should validate if value is not a number", async () => {
    let validated = await validateSensorData(
      1000,
      "Pressure",
      "abc",
      "2024-11-11 11:11:11"
    );
    expect(validated).toEqual("Value is required and must be a number");
  });

  it("should validate if timestamp is missing", async () => {
    let validated = await validateSensorData(1000, "Pressure", 2, "");
    expect(validated).toEqual("Timestamp is required");
  });

  it("should validate if timestamp is not in a valid format", async () => {
    await truncateFile(dataFilePath)
    let validated = await validateSensorData(
      1000,
      "Pressure",
      2,
      "01/02/2024 11:43:22"
    );
    expect(validated).toEqual(
      "Invalid timestamp format. Please use the format YYYY-MM-DD H:i:s"
    );
  });

  it("should validate if sensorId already exists", async () => {
    await sensorService.storeSensorData(50000, "Temprature", 2,"2024-11-11 11:11:11",dataFilePath);

    let validated = await validateSensorData(
      50000,
      "Temprature",
      2,
      "2024-11-11 11:11:11",
      dataFilePath
    );

    expect(validated).toEqual("A record with same sensor ID exists");
  });
});
