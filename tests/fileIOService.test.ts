import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { readFromFile, truncateFile, writeToFile } from "../src/services/fileIOService";

    

describe("File I/O Service Tests", () => {
    
    const dataFilePath = './data.test.json';
    const testFileContent = '[]';
    beforeAll(async () => {
        await truncateFile(dataFilePath);
    });

    afterAll(async () => {
        await truncateFile(dataFilePath);
    });

    it("should read data from a file", async () => {
        const data = await readFromFile(dataFilePath);
        expect(data).toEqual(testFileContent);
    });

    it("should write data to a file", async () => {
        const newData = 'New content';
        await writeToFile(dataFilePath, newData);
        const data = await readFromFile(dataFilePath);
        expect(data).toEqual(newData);
    });

    it("should truncate a file to empty array", async () => {
        // Truncate the file to empty array
        await truncateFile(dataFilePath);
        const data = await readFromFile(dataFilePath);
        expect(data).toEqual('[]');
    });

});
