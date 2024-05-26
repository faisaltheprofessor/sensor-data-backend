const fs = require('fs');

export const logToFile = (logMessage:string, filePath:string = 'storage/log.txt', error = false)  => {
    const type = error ? "❌"  : "✅" 
    fs.appendFile(filePath, `${type} ${new Date()}: ${logMessage + '\n'}`, (err: any) => {
        if (err) {
            // TODO
        } else {
            // TODO
        }
    });
};
