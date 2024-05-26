import { logToFile } from "../utils/logger";

const fs = require('fs')


const readFromFile = async (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.writeFile(filePath, '[]', (err: any) => {
                        if (err) {
                            console.error(`Error creating file ${filePath}:`, err);
                            reject(`Error creating file ${filePath}`);
                        } else {
                            resolve('[]');
                        }
                    });
                } else {
                    console.error(`Error reading from file ${filePath}:`, err);
                    reject(`Error reading from file ${filePath}`);
                }
            } else {
                resolve(data);
            }
        });
    });
}


const writeToFile = async (filePath: string, data: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err: Error) => {
            if (err) {
                logToFile(`Error writing to file ${filePath}: ${err}`);
                reject(`Error writing to file ${filePath}`);
            } else {
                logToFile(`Data saved to file ${filePath} successfully`);
                resolve();
            }
        });
    });
}


const truncateFile = async (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, "[]", (err: Error) => {
            if (err) {
                console.error(`Error truncating file ${filePath}:`, err);
                reject(`Error truncating file ${filePath}`);
            } else {
                logToFile(`File ${filePath} truncated successfully`);
                resolve();
            }
        });
    });
}

export { readFromFile, writeToFile, truncateFile};
