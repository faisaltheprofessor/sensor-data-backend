import express from "express"
import { getSensorData, createSensorData, wildCardRoute } from "./controllers/sensorController"

const router = express.Router()

// Define routes
router.get("/sensors/data", getSensorData)
router.post("/sensors/data", createSensorData)

// Wildcard to handle other routes
router.get("*", wildCardRoute)
export { router }
