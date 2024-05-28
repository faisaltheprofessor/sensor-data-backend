import { Request, Response } from "express"
import { sensorService } from "../services/sensorService"
import { validateSensorData } from "../utils/requestValidatior"
import { logToFile } from "../utils/logger"

/**
 * Retrieves paginated sensor data based on query parameters.
 * 
 * @param {Request} req - The request object containing query parameters for pagination.
 * @param {Response} res - The response object to send the retrieved sensor data as a JSON response.
 * @returns {Promise<void>} - A Promise that resolves when the data retrieval and response sending is complete.
 */
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

/**
 * Stores sensor data received in the request body after validation.
 * 
 * @param {Request} req - The request object containing sensor data to be stored.
 * @param {Response} res - The response object to send back the status of the data storage operation.
 * @returns {Promise<void>} - A Promise that resolves when the sensor data is validated, stored, and a response is sent.
 */
export const storeSensorData = async (req: Request, res: Response) => {

  // get the data
  const { sensorId, type, value, timestamp } = req.body

  // Validate the data
  const validationError = await validateSensorData(sensorId, type, value, timestamp)
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
      res.status(201).json({ success: true, data: newData })
    })
    .catch((error) => {
      logToFile("Error saving sensor data: `${err}`", undefined, true)

      console.error("\x1b[31mError saving sensor data:\x1b[0m", error)
      res.status(500).json({ success: false, error: `${error.message}` })
    })
}

/**
 * Handles wildcard routes.
 * 
 * @param {Request} req - The request object for the unrecognized route.
 * @param {Response} res - The response object to send a 404 status response for the route not found.
 * @returns {void} - No return value. Logs a message and sends a response with a 404 status for a route not found.
 */
export const wildCardRoute = (req: Request, res: Response) => {
  logToFile(`Route not found: ${req.url}`, undefined, true)
  console.log(`\x1b[31mRoute not found: ${req.url} \x1b[0m`)
  res.status(404).json({ error: "Route not Found!" })
}
