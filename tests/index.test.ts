import {describe, it, expect} from 'vitest'
import { readFromFile, writeToFile } from '../src/services/fileIOService'
import { sensorService } from '../src/services/sensorService';



describe("Sensor Service Tests", async () => {
    let sensorData: any = []
    let dataFilePath = './data.test.json'

    it("should add new sensor data successfully", async () => {
        const newData = await sensorService.addSensorData(1, "pressure", 30, "2024-05-25 13:30:45", dataFilePath);
        expect(newData).toMatchObject({ sensorId: 1, value: 30, type: "pressure" });
    })

    it("should reject adding new sensor data if sensorId already exists", async () => {
        const newData = await sensorService.addSensorData(2, "humidity", 20, "2024-05-25 13:30:45", dataFilePath);
        expect(newData).toMatchObject({ sensorId: 2, value: 20, type: "humidity" });

        try 
        {
            const someData = await sensorService.addSensorData(2, "humidity", 20, "2024-05-25 13:30:45", dataFilePath)
        } catch(err)
        {
            expect(err).toMatch("\x1b[32mA record with sensor id 2 exists\x1b[0m");
        }
    })
})
