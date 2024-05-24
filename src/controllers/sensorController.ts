import { Request, Response } from "express";
import { sensorService } from "../services/sensorService";

// GET /sensors/data
export const getSensorData = (req: Request, res: Response) => {
  const { page = "1", limit = "10", desc } = req.query;

  sensorService.getPaginatedSensorData(Number(page), Number(limit), desc === "true")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error("Error retrieving sensor data", error);
      res.status(500).json({ error: "Error retrieving sensor data" });
    });
};

// POST /sensors/data
export const createSensorData = (req: Request, res: Response) => {
  const { sensorId, type, value, timestamp } = req.body;

  sensorService.addSensorData(Number(sensorId), type, Number(value), timestamp)
    .then((newData) => {
      res.status(201).json({ success: true, data: newData });
    })
    .catch((error) => {
      console.error("Error saving sensor data", error);
      res.status(500).json({ success: false, error: `A record with sensor id ${sensorId} exists` });
    });
};