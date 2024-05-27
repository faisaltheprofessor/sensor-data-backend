import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { sensorService } from "../src/services/sensorService"
import { generateFakeData } from "../src/utils/helpers"
import { deleteFileSync, truncateFile } from "../src/services/fileIOService"

let dataFilePath = "./data.test.json"

describe("Sensor Service Tests", () => {
  it("should store new sensor data successfully", async () => {
    await truncateFile(dataFilePath)
    const newData = await sensorService.storeSensorData(1, "Pressure", 30, "2024-05-25 13:30:45", dataFilePath)
    expect(newData).toMatchObject({ sensorId: 1, value: 30, type: "Pressure", timestamp: "2024-05-25 13:30:45" })
  })

  it("should return specified number of records based on pagination limit", async () => {
    await truncateFile(dataFilePath)
    await generateFakeData(30)
    let paginatedData = await sensorService.getPaginatedSensorData(1, 5, false, dataFilePath)
    expect(paginatedData.data.length).toEqual(5)

    paginatedData = await sensorService.getPaginatedSensorData(1, 10, false, dataFilePath)
    expect(paginatedData.data.length).toEqual(10)

    paginatedData = await sensorService.getPaginatedSensorData(1, 20, false, dataFilePath)
    expect(paginatedData.data.length).toEqual(20)
  })

  it("should have correct pagination links", async () => {
    const paginatedData = await sensorService.getPaginatedSensorData(1, 10, false, dataFilePath)
    expect(paginatedData.links.self).toEqual("/sensors/data?page=1&desc=false")
    expect(paginatedData.links.first).toEqual("/sensors/data?page=1&desc=false")
    expect(paginatedData.links.last).toEqual("/sensors/data?page=3&desc=false")
    expect(paginatedData.links.next).toEqual("/sensors/data?page=2&desc=false")
    expect(paginatedData.links.prev).toBeNull()

    const morePaginatedData = await sensorService.getPaginatedSensorData(2, 5, true, dataFilePath)
    expect(morePaginatedData.links.self).toEqual("/sensors/data?page=2&desc=true")
    expect(morePaginatedData.links.first).toEqual("/sensors/data?page=1&desc=true")
    expect(morePaginatedData.links.last).toEqual("/sensors/data?page=6&desc=true")
    expect(morePaginatedData.links.next).toEqual("/sensors/data?page=3&desc=true")
    expect(morePaginatedData.links.prev).toEqual("/sensors/data?page=1&desc=true")
  })

  it("can get the data in ascending order", async () => {
    let paginatedData = await sensorService.getPaginatedSensorData(1, 1, false, dataFilePath)
    expect(paginatedData.data[0].sensorId).toEqual(1)
  })

  it("can get the data in descending order", async () => {
    let paginatedData = await sensorService.getPaginatedSensorData(1, 1, true, dataFilePath)
    expect(paginatedData.data[0].sensorId).toEqual(30)
  })
})
