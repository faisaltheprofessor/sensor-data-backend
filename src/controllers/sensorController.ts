import { Request, Response } from "express"
import { sensorService } from "../services/sensorService"
import { validateSensorData } from "../utils/requestValidatior"
import { logToFile } from "../utils/logger"

// GET /sensors/data
export const getSensorData = (req: Request, res: Response) => {
  const { page = "1", limit = "10", desc = false } = req.query
  sensorService.getPaginatedSensorData(Number(page), Number(limit), desc === "true")
    .then((data) => {
      res.json(data)
    })
    .catch((error) => {
      console.error("Error retrieving sensor data", error)
      res.status(500).json({ error: "Error retrieving sensor data" })
    })
}

// POST /sensors/data
export const storeSensorData = async (req: Request, res: Response) => {

  // get the data
  const { sensorId, type, value, timestamp } = req.body

  // Validate the data
  const validationError = await validateSensorData(sensorId, type, value, timestamp);
  if (validationError) {
    res.status(500).json({
      success: false,
      message: validationError
    })
    return
  }

// Store the data
  sensorService.storeSensorData(Number(sensorId), type, Number(value), timestamp)
    .then((newData) => {
      res.status(201).json({ success: true, data: newData });
    })
    .catch((error) => {
      logToFile("Error saving sensor data: ", error);

      console.error("\x1b[31mError saving sensor data:\x1b[0m", error);
      res.status(500).json({ success: false, error: `${error.message}` });
    });
}

// Wildcard Route
export const wildCardRoute = (req: Request, res: Response) => {
  logToFile(`Route not found: ${ req.url }`)
  console.log(`\x1b[31mRoute not found: ${ req.url } \x1b[0m`)
  res.status(404).json({ error: "Route not Found!" })
}
