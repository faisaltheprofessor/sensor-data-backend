import { logToFile } from "../utils/logger"
import { readFromFileOrCreate, writeToFile } from "./fileIOService"

interface SensorData {
    sensorId: number
    value: number
    type: string
    timestamp: string
}

let sensorData: SensorData[] = []

/**
 * Retrieves paginated sensor data from a file db.
 * 
 * @param {number} page - The page number for the pagination.
 * @param {number} limit - The limit of sensor data to be displayed on each page.
 * @param {boolean} desc - A flag indicating whether data should be sorted in descending order.
 * @param {string} filePath - The path to the file containing sensor data (default: './data.json').
 * @returns {Promise<any>} - A Promise that resolves with paginated sensor data and pagination information.
 */
const getPaginatedSensorData = (page: number, limit: number, desc: boolean, filePath: string = './data.json'): Promise<any> => {
    return readFromFileOrCreate(filePath)
        .then((data) => {
            sensorData = JSON.parse(data)
            const startIndex = (page - 1) * limit
            const endIndex = page * limit
            const paginatedData = desc ? sensorData.slice().reverse().slice(startIndex, endIndex) : sensorData.slice(startIndex, endIndex)
            const nextPage = page + 1
            const prevPage = page - 1
            const totalPages = Math.ceil(sensorData.length / limit)

            const baseUrl = "/sensors/data"
            const selfUrl = `${baseUrl}?page=${page}&desc=${desc || "false"}`
            const firstUrl = `${baseUrl}?page=1&desc=${desc || "false"}`
            const lastUrl = `${baseUrl}?page=${totalPages}&desc=${desc || "false"}`
            const nextUrl = nextPage <= totalPages ? `${baseUrl}?page=${nextPage}&desc=${desc || "false"}` : null
            const prevUrl = prevPage > 0 ? `${baseUrl}?page=${prevPage}&desc=${desc || "false"}` : null

            const paginationInfo = {
                data: paginatedData,
                links: {
                    self: selfUrl,
                    first: firstUrl,
                    last: lastUrl,
                    next: nextUrl,
                    prev: prevUrl
                }
            }

            return paginationInfo
        })
}

/**
 * Stores sensor data in a file asynchronously.
 * 
 * @param {number} sensorId - The ID of the sensor.
 * @param {string} type - The type of sensor data.
 * @param {number} value - The value of the sensor data.
 * @param {string} timestamp - The timestamp of the sensor data.
 * @param {string} filePath - The path to the file where sensor data will be stored (default: './data.json').
 * @returns {Promise<any>} - A Promise that resolves with the newly stored sensor data.
 */
const storeSensorData = (sensorId: number, type: string, value: number, timestamp: string, filePath: string = './data.json'): Promise<any> => {
    return readFromFileOrCreate(filePath)
        .then((data) => {
            // Update sensorData with the current data
            sensorData = JSON.parse(data) 
            const newData = { sensorId, type, value, timestamp }
            // Push new data into the sensorData array
            sensorData.push(newData) 
            return writeToFile(filePath, JSON.stringify(sensorData))
                .then(() => {
                    logToFile(JSON.stringify(newData))
                    return newData
                })
                .catch((error) => {
                    console.error("\x1b[31mError saving data\x1b[0m")
                    throw { status: 503, data: { success: false, error: "Error saving data" } }
                })
        })
}

export const sensorService = {
    getPaginatedSensorData,
    storeSensorData
}
