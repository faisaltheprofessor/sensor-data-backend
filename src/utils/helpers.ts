import { sensorService } from "../services/sensorService";

export const generateFakeData = async (limit = 10, start = 1, dataFilePath = './data.test.json'): Promise<void> => {
    let type = ["Pressure", "Humidity", "pH", "Pressure"];
    let id = start;
    for (let i = 0; i < limit; i++) {
        let randomType = type[Math.floor(Math.random() * type.length)];
        let randomValue = Math.floor(Math.random() * 100);
        await sensorService.storeSensorData(id, randomType, randomValue, "2024-05-25 13:30:45", dataFilePath);
        id++;
    }
}
