import express from "express";
import { getSensorData, createSensorData } from "./controllers/sensorController";

const router = express.Router();

// Define routes
router.get("/sensors/data", getSensorData);
router.post("/sensors/data", createSensorData);

export { router };
