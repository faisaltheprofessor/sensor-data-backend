import { sensorService } from "../services/sensorService"
const fs = require('fs')
/**
 * Generates fake sensor data and stores it in a file.
 * 
 * @param {number} limit - The number of fake sensor data entries to generate (default: 10).
 * @param {number} start - The starting ID for the fake sensor data entries (default: 1).
 * @param {string} dataFilePath - The path to the file where the fake sensor data will be stored (default: './data.test.json').
 * @returns {Promise<void>} - A Promise that resolves once the fake sensor data is generated and stored.
 */
export const generateFakeData = async (limit = 10, start = 1, dataFilePath = './data.test.json'): Promise<void> => {
    let type = ["Pressure", "Humidity", "pH", "Pressure"]
    let id = start
    for (let i = 0; i < limit; i++) {
        let randomType = type[Math.floor(Math.random() * type.length)]
        let randomValue = Math.floor(Math.random() * 100)
        await sensorService.storeSensorData(id, randomType, randomValue, "2024-05-25 13:30:45", dataFilePath)
        id++
    }
}
