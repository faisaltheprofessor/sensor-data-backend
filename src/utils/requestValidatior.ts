import { readFromFile, writeToFile } from "../services/fileIOService";
import { sensorService } from "../services/sensorService";
import { logToFile } from "./logger";

export const validateSensorData = async (
  sensorId: number | string,
  type: string,
  value: number,
  timestamp: string,
  dataFile: string = "./data.json"
) => {
  const errors = [];

  if (!Number(sensorId) || isNaN(Number(sensorId))) {
    errors.push("Sensor ID is required and must be a number");
  } else {
    let data = JSON.parse(await readFromFile(dataFile));
    if (
      data.some(
        (record: { sensorId: number }) => record.sensorId === Number(sensorId)
      )
    ) {
      errors.push("A record with same sensor ID exists");
    }
  }
  
  if (!type) {
    errors.push("Type is required");
  }
  if (typeof type !== "string") {
    errors.push("Type must be a string");
  }
  if (!value || isNaN(value)) {
    errors.push("Value is required and must be a number");
  }
  if (!timestamp) {
    errors.push("Timestamp is required");
  } else if (!timestamp.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
    errors.push(
      "Invalid timestamp format. Please use the format YYYY-MM-DD H:i:s"
    );
  }

  if (errors.length > 0) {
    logToFile(JSON.stringify(errors), undefined, true)
    return errors.join(". ");
  }

  return null;
};

