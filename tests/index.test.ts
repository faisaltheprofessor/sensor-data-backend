
import { describe, it, expect, beforeAll } from 'vitest';
import { sensorService } from '../src/services/sensorService';
import { generateFakeData } from '../src/utils/helpers';
import { truncateFile } from '../src/services/fileIOService';

let dataFilePath = './data.test.json';

describe("Sensor Service Tests", async () => {
     // Setup step to truncate the file
     beforeAll(async () => {
        await truncateFile(dataFilePath);
    });

    // Test case to add new sensor data successfully
    it("should add new sensor data successfully", async () => {
        const newData = await sensorService.addSensorData(1, "pressure", 30, "2024-05-25 13:30:45", dataFilePath);
        expect(newData).toMatchObject({ sensorId: 1, value: 30, type: "pressure" });
    });

    it("should return specified number of records based on pagination limit", async () => {
            await generateFakeData(30,2)
            let paginatedData = await sensorService.getPaginatedSensorData(1, 5, false, dataFilePath);
            expect(paginatedData.data.length).toEqual(5);
        
            paginatedData = await sensorService.getPaginatedSensorData(1, 10, false, dataFilePath);
            expect(paginatedData.data.length).toEqual(10);
        
            paginatedData = await sensorService.getPaginatedSensorData(1, 20, false, dataFilePath);
            expect(paginatedData.data.length).toEqual(20);
        })
        
    });
    // Test case for pagination links
    // it("should have correct pagination links", async () => {
    //     const paginatedData = await sensorService.getPaginatedSensorData(1, 10, false, dataFilePath);
    //     expect(paginatedData.links.self).toEqual('/sensors/data?page=1&desc=false');
    //     expect(paginatedData.links.first).toEqual('/sensors/data?page=1&desc=false');
    //     expect(paginatedData.links.last).toEqual('/sensors/data?page=3&desc=false');
    //     expect(paginatedData.links.next).toEqual('/sensors/data?page=2&desc=false');
    //     expect(paginatedData.links.prev).toBeNull();
    // });
