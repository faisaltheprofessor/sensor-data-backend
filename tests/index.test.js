"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fs_1 = __importDefault(require("fs"));
const app_1 = __importDefault(require("../src/app")); // Assuming your router is exported from "./router"
const node_test_1 = require("node:test");
(0, vitest_1.describe)("Sensor Data API Tests", () => {
    (0, node_test_1.before)(() => {
        // Create a test data file
        fs_1.default.writeFileSync("./test-data.json", "[]");
    });
    (0, node_test_1.after)(() => {
        // Clean up after tests
        fs_1.default.unlinkSync("./test-data.json");
    });
    (0, vitest_1.it)("should return paginated sensor data", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock Express Request and Response objects
        const req = { query: { page: "1", limit: "10", desc: "false" } };
        let resData;
        const res = {
            json(data) {
                resData = data;
            },
        };
        // Mock Express Router GET /sensors/data handler
        yield app_1.default.get("/sensors/data", req, res);
        // Add your assertions based on the expected response data
        (0, vitest_1.expect)(resData).toBeDefined();
        // Add more assertions based on the expected response data
    }));
    (0, vitest_1.it)("should add new sensor data", () => __awaiter(void 0, void 0, void 0, function* () {
        // Mock Express Request and Response objects with sample data
        const req = {
            body: { sensorId: 1, type: "temperature", value: 25, timestamp: "2024-05-24 12:00:00" },
        };
        let resData;
        const res = {
            status(statusCode) {
                return {
                    json(data) {
                        resData = data;
                    },
                };
            },
        };
        // Mock Express Router POST /sensors/data handler
        yield app_1.default.post("/sensors/data", req, res);
        // Add your assertions based on the expected response data
        (0, vitest_1.expect)(resData).toBeDefined();
        // Add more assertions based on the expected response data
    }));
});
