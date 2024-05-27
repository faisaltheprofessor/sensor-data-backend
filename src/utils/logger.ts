const fs = require('fs')

/**
 * Logs a message to a file with an optional error indicator.
 * 
 * @param {string} logMessage - The message to be logged.
 * @param {string} filePath - The path to the log file (default: 'storage/log.txt').
 * @param {boolean} error - A flag indicating whether the message relates to an error (default: false).
 */
export const logToFile = (logMessage:string, filePath:string = 'storage/log.txt', error = false)  => {
    const type = error ? "❌"  : "✅" 
    fs.appendFile(filePath, `${type} ${new Date()}: ${logMessage + '\n'}`, (err: any) => {
        if (err) {
            // TODO
        } else {
            // TODO
        }
    })
}
