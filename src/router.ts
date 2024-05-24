import express from "express";
import { Request, Response } from "express";
const fs = require("fs");

const router = express.Router();

interface SensorData {
  sensorId: number;
  value: number;
  type: string;
  timestamp: number;
}

let sensorData: SensorData[] = [];

fs.readFile("./data.json", "utf8", (err: Error, data: string) => {
  if (err) {
    fs.writeFile("./data.json", "[]", (err: any) => {
      if (err) {
        console.error("\x1b[31mError creating data.json\x1b[0m");
      } else {
        console.log("\x1b[32mData.json file created successfully\x1b[0m");
      }
    });
  } else {
    sensorData = JSON.parse(data);
    console.log("\x1b[32mExisting sensor data loaded successfully\x1b[0m");
  }
});

router.get("/sensors/data", (req: Request, res: Response) => {
  const { page = "1", limit = "10", desc } = req.query;
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = Number(page) * Number(limit);

  fs.readFile(
    "./data.json",
    "utf8",
    (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        console.error("\x1b[31mError reading data file\x1b[0m");
        return res.status(500).json({ error: "Error reading data file" });
      }

      const sensorData = JSON.parse(data);

      let paginatedData =
        desc === "true"
          ? sensorData.slice().reverse().slice(startIndex, endIndex)
          : sensorData.slice(startIndex, endIndex);
      const nextPage = Number(page) + 1;
      const prevPage = Number(page) - 1;
      const totalPages = Math.ceil(sensorData.length / Number(limit));
      const baseUrl = `${req.protocol}://${req.get("host")}/sensors/data`;
      const selfUrl = `${baseUrl}?page=${page}&desc=${desc || "false"}`;
      const firstUrl = `${baseUrl}?page=1&desc=${desc || "false"}`;
      const lastUrl = `${baseUrl}?page=${totalPages}&desc=${desc || "false"}`;
      const nextUrl =
        nextPage <= totalPages
          ? `${baseUrl}?page=${nextPage}&desc=${desc || "false"}`
          : null;
      const prevUrl =
        prevPage > 0
          ? `${baseUrl}?page=${prevPage}&desc=${desc || "false"}`
          : null;

      const links = {
        self: selfUrl,
        first: firstUrl,
        last: lastUrl,
        next: nextUrl,
        prev: prevUrl,
      };

      res.json({ data: paginatedData, links });
    }
  );
});

router.post("/sensors/data", (req: Request, res: Response) => {
  const { sensorId, type, value, timestamp } = req.body;
  const errors = [];

  if (
    !sensorId ||
    isNaN(sensorId) ||
    !Number.isInteger(Number(sensorId)) ||
    sensorData.some((data) => data.sensorId === Number(sensorId))
  ) {
    errors.push(
      !sensorId ? "sensorId is missing" : "sensorId must be an integer"
    );
    if (sensorData.some((data) => data.sensorId === Number(sensorId)))
      errors.push("sensorId must be unique");
    console.error(`\x1b[31mSensor ID ${sensorId} already exists\x1b[0m`);
    return res
      .status(500)
      .json({
        success: false,
        error: "A record with the same Sensor ID exists",
      });
  }

  if (!type) errors.push("type is missing");
  if (!value || isNaN(value) || !Number.isFinite(Number(value)))
    errors.push(!value ? "value is missing" : "Value must be a numeric value");

  if (
    !timestamp ||
    !/^\d{4}-\d{2}-\d{2} (?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(timestamp)
  ) {
    console.log(timestamp);
    errors.push(
      !timestamp
        ? "timestamp is missing"
        : "Timestamp must be valid and in the format: yyyy-mm-dd HH:mm:ss"
    );
    return res.status(500).json({ success: false, error: "Timestamp is missing or not in format: yyyy-mm-dd HH:mm:ss" });
  }

  if (errors.length > 0) {
    console.error("\x1b[31mValidation errors:\x1b[0m", errors);
    return res.status(400).json({ errors });
  }

  const newSensorData = { sensorId: Number(sensorId), type, value, timestamp };
  sensorData.push(newSensorData);

  fs.writeFile("./data.json", JSON.stringify(sensorData), (err: string) => {
    if (err) {
      console.error("\x1b[31mError saving data\x1b[0m");
      return res
        .status(500)
        .json({ success: false, error: "Error saving data" });
    }
    console.log(
      "\x1b[32mNew sensor data saved successfully:\x1b[0m",
      newSensorData
    );
    return res.status(201).json({ success: true, data: newSensorData });
  });
});

export { router };
