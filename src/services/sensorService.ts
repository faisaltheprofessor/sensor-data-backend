import { readFromFile, writeToFile } from "./fileIOService"
interface SensorData {
    sensorId: number
    value: number
    type: string
    timestamp: string
}

let sensorData: SensorData[] = []
let dataFilePath = './data.json'

// Initial Load
readFromFile(dataFilePath)
.then((data) => {
    sensorData = JSON.parse(data);
    console.log("\x1b[32mExisting sensor data loaded successfully\x1b[0m");
})
.catch(() => {
    // File doesn't exist, initialize with empty array
    writeToFile(dataFilePath, "[]")
        .then(() => {
            console.log("\x1b[32mData.json file created successfully\x1b[0m");
        })
        .catch((error) => {
            console.error("Error creating data.json:", error);
        });
});


// Get paginated sensor data with pagination links
const getPaginatedSensorData = (page: number, limit: number, desc: boolean): Promise<any> => {
    // Read from file to ensure latest changes (like manual changes or changes to file by other sources) are retrieved
// TODO: Refactor
        readFromFile(dataFilePath)
        .then((data) => {
            sensorData = JSON.parse(data);
        })
    
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


const addSensorData = (sensorId: number, type: string, value: number, timestamp: string, filePath: string = dataFilePath): Promise<any> => {
    return new Promise((resolve, reject) => {
        const newData = { sensorId, type, value, timestamp };
        sensorData.push(newData);
        writeToFile(filePath, JSON.stringify(sensorData))
            .then(() => {
                console.log("\x1b[32mNew sensor data saved successfully:\x1b[0m", newData);
                resolve(newData);
            })
            .catch((error) => {
                console.error("\x1b[31mError saving data\x1b[0m");
                reject({ status: 503, data: { success: false, error: "Error saving data" } });
            });
    });
};

export const sensorService = {
    getPaginatedSensorData,
    addSensorData
}
