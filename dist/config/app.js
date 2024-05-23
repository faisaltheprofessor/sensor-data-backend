"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedOrigins = exports.PORT = void 0;
// Port on which the server will run
const PORT = 8000;
exports.PORT = PORT;
// Define the allowed origins for Cross-Origin Resource Sharing (CORS)
// Add more origins to the array if needed
const allowedOrigins = [
    "http://localhost:3000",
];
exports.allowedOrigins = allowedOrigins;
