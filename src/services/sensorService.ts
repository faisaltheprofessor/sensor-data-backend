const fs = require('fs')

interface SensorData {
    sensorId: number
    value: number
    type: string
    timestamp: number
}

let sensorData: SensorData[] = []

// Load sensor data from file or initialize if file doesn't exist
fs.readFile("./data.json", "utf8", (err: Error, data: string) => {
    if (err) {
        fs.writeFile("./data.json", "[]", (err: any) => {
            if (err) {
                console.error("Error creating data.json")
            } else {
                console.log("\x1b[32Data.json file created successfully\x1b[0m")
            }
        })
    } else {
        sensorData = JSON.parse(data)
        console.log("\x1b[32mExisting sensor data loaded successfully\x1b[0m")
    }
})

// Get paginated sensor data with pagination links
const getPaginatedSensorData = (page: number, limit: number, desc: boolean): Promise<any> => {
    return new Promise((resolve, reject) => {
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
      
        resolve(paginationInfo)
    })
}


// Add new sensor data
const addSensorData = (sensorId: number, type: string, value: number, timestamp: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (sensorData.some((data) => data.sensorId === sensorId)) {
            reject(`\x1b[32mA record with sensor id ${sensorId} exists\x1b[0m`)
        } else {
            const newData = { sensorId, type, value, timestamp }
            sensorData.push(newData)

            fs.writeFile("./data.json", JSON.stringify(sensorData), (err: string) => {
                if (err) {
                    console.error("\x1b[31mError saving data\x1b[0m")
                    reject("Error saving data")
                } else {
                    console.log("\x1b[32mNew sensor data saved successfully:\x1b[0m", newData)
                    resolve(newData)
                }
            })
        }
    })
}

export const sensorService = {
    getPaginatedSensorData,
    addSensorData
}
