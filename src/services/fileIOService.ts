const fs = require('fs')

const readFromFile = async (filePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err: Error, data: string) => {
            if (err) {
                console.error(`Error reading from file ${filePath}:`, err);
                reject(`Error reading from file ${filePath}`);
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
                console.error(`Error writing to file ${filePath}:`, err);
                reject(`Error writing to file ${filePath}`);
            } else {
                console.log(`Data saved to file ${filePath} successfully`);
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
                console.log(`File ${filePath} truncated successfully`);
                resolve();
            }
        });
    });
}


export { readFromFile, writeToFile, truncateFile};
