import { readFromFile } from "../services/fileIOService";
import { sensorService } from "../services/sensorService";

export const generateFakeData = async (limit = 10, start = 1, dataFilePath = './data.test.json'): Promise<void> => {
    let type = ["Pressure", "Humidity", "pH", "Pressure"];
    let id = start
    for (let i = 0; i < limit; i++) {
        let randomType = type[Math.floor(Math.random() * type.length)];
        let randomValue = Math.floor(Math.random() * 100);
        await sensorService.addSensorData(id, randomType, randomValue, "2024-05-25 13:30:45", dataFilePath);
        id++;
    }
  }
  
  export const loadData = async (filePath: string): Promise<any> => {
    try {
        const data = await readFromFile(filePath);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading data:", error);
        throw error;
    }
  }