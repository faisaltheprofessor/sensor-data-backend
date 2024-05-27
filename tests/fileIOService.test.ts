import { afterAll, describe, expect, it, vi } from "vitest"
import { deleteFile, readFromFileOrCreate, truncateFile, writeToFile } from "../src/services/fileIOService"

describe("File I/O Service Tests", async () => {
  afterAll(async () => {
    vi.resetModules()

    await deleteFile('./data.test.json')
  })
  const dataFilePath = "./data.test.json"

  it("should truncate a file to an empty array", async () => {
    await truncateFile(dataFilePath)
    const data = await readFromFileOrCreate(dataFilePath)
    expect(data).toEqual("[]")
  })

  it("should write data to the file", async () => {
    const newData = {
      sensorId: 1,
      type: "Pressure",
      value: 30,
      timestamp: "2024-05-25 13:30:45",
    }

    const dataArray = [newData]
    await writeToFile(dataFilePath, JSON.stringify(dataArray))
    const data = await readFromFileOrCreate(dataFilePath)
    expect(JSON.parse(data)).toContainEqual(newData)
  })

  it("should read data from the file", async () => {
    const data = await readFromFileOrCreate(dataFilePath)
    expect(data).toEqual(JSON.stringify([{
      sensorId: 1,
      type: "Pressure",
      value: 30,
      timestamp: "2024-05-25 13:30:45",
    }]))
  })
})
