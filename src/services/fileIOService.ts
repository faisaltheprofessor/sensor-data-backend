import { logToFile } from "../utils/logger"

const fs = require('fs')

/**
 * Reads data from a file asynchronously.
 * 
 * @param {string} filePath - The path to the file from which data will be read.
 * @returns {Promise<string>} - A Promise that resolves with the data read from the file as a string.
 */
const readFromFile = async (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.writeFile(filePath, '[]', (err: any) => {
                        if (err) {
                            logToFile(`Error creating file ${filePath}: ${err}`, undefined, true)
                            console.error(`Error creating file ${filePath}:`, err)
                            reject(`Error creating file ${filePath}`)
                        } else {
                            resolve('[]')
                        }
                    })
                } else {
                    logToFile(`Error reading from file ${filePath}: ${err}`, undefined, true)
                    console.error(`Error reading from file ${filePath}:`, err)
                    reject(`Error reading from file ${filePath}`)
                }
            } else {
                try {
                    JSON.parse(data)
                    resolve(data)
                } catch (jsonError) {
                    logToFile(`Invalid JSON data in file ${filePath}: ${jsonError}`, undefined, true)
                    console.error(`Invalid JSON data in file ${filePath}:`, jsonError)
                    reject(`Invalid JSON data in file ${filePath}`)
                }
            }
        })
    })
}

/**
 * Writes data to a file asynchronously.
 * 
 * @param {string} filePath - The path to the file where data will be written.
 * @param {string} data - The data to be written to the file.
 * @returns {Promise<void>} - A Promise that resolves when the data is successfully written to the file.
 */
const writeToFile = async (filePath: string, data: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err: Error) => {
            if (err) {
                logToFile(`Error writing to file ${filePath}: ${err}`)
                reject(`Error writing to file ${filePath}`)
            } else {
                logToFile(`Data saved to file ${filePath} successfully`)
                resolve()
            }
        })
    })
}

/**
 * Truncates a file by overwriting its content with an empty array representation.
 * 
 * @param {string} filePath - The path to the file to be truncated.
 * @returns {Promise<void>} - A Promise that resolves when the file is successfully truncated.
 */
const truncateFile = async (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, '[]', (err: Error) => {
            if (err) {
                console.error(`Error truncating file ${filePath}:`, err)
                reject(`Error truncating file ${filePath}`)
            } else {
                logToFile(`File ${filePath} truncated successfully`)
                resolve()
            }
        })
    })
}

/**
 * Deletes a file.
 * 
 * @param {string} filePath - The path to the file to be deleted.
 * @returns {Promise<void>} - A Promise that resolves when the file is successfully deleted.
 */
const deleteFile = async (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err: Error) => {
            if (err) {
                logToFile(`Error deleting file ${filePath}: ${err}`)
                reject(`Error deleting file ${filePath}`)
            } else {
                logToFile(`File ${filePath} deleted successfully`)
                resolve()
            }
        })
    })
}

/**
 * Deletes a file synchronously.
 * 
 * @param {string} filePath - The path to the file to be deleted.
 * @returns {void} - No return value. Deletes the file synchronously.
 */
export const deleteFileSync = (filePath: string) => {
    try {
        fs.unlinkSync(filePath);
        console.log(`File ${filePath} deleted successfully`);
    } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
    }
}

export { readFromFile, writeToFile, truncateFile, deleteFile }
