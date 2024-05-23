"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const allowedOrigins = require('./config/allowedOrigins.js');
const PORT = 8000;
let sensorData = [];
const app = express();
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
app.use(express.urlencoded({ extended: true }));
// Load existing sensor data from data.json when the server starts
fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
        fs.writeFile('./data.json', '[]', (err) => {
            if (err) {
                console.error('\x1b[31mError creating data.json\x1b[0m');
            }
            else {
                console.log('\x1b[32mData.json file created successfully\x1b[0m');
            }
        });
    }
    else {
        sensorData = JSON.parse(data);
        console.log('\x1b[32mExisting sensor data loaded successfully\x1b[0m');
    }
});
// GET endpoint to retrieve sensor data with pagination
app.get('/sensors/data', (req, res) => {
    const { page = "1", limit = "10", desc } = req.query;
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = Number(page) * Number(limit);
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('\x1b[31mError reading data file\x1b[0m');
            return res.status(500).json({ error: 'Error reading data file' });
        }
        let sensorData = JSON.parse(data);
        console.log('\x1b[32mSensor data retrieved for pagination\x1b[0m');
        let paginatedData = desc === 'true' ?
            sensorData.slice().reverse().slice(startIndex, endIndex) :
            sensorData.slice(startIndex, endIndex);
        const nextPage = Number(page) + 1;
        const prevPage = Number(page) - 1;
        const totalPages = Math.ceil(sensorData.length / Number(limit));
        const baseUrl = `${req.protocol}://${req.get('host')}/sensors/data`;
        const selfUrl = `${baseUrl}?page=${page}&desc=${desc || 'false'}`;
        const firstUrl = `${baseUrl}?page=1&desc=${desc || 'false'}`;
        const lastUrl = `${baseUrl}?page=${totalPages}&desc=${desc || 'false'}`;
        const nextUrl = nextPage <= totalPages ? `${baseUrl}?page=${nextPage}&desc=${desc || 'false'}` : null;
        const prevUrl = prevPage > 0 ? `${baseUrl}?page=${prevPage}&desc=${desc || 'false'}` : null;
        const links = {
            self: selfUrl,
            first: firstUrl,
            last: lastUrl,
            next: nextUrl,
            prev: prevUrl
        };
        console.log('\x1b[32mPagination links generated\x1b[0m');
        res.json({ data: paginatedData, links });
    });
});
// POST endpoint to store sensor data
app.post('/sensors/data', (req, res) => {
    const { sensorId, type, value, timestamp } = req.body;
    const errors = [];
    if (!sensorId) {
        errors.push('sensorId is missing');
    }
    else if (isNaN(sensorId) || !Number.isInteger(Number(sensorId))) {
        errors.push('sensorId must be an integer');
    }
    else if (sensorData.some(data => data.sensorId === Number(sensorId))) {
        errors.push('sensorId must be unique');
        console.error(`\x1b[31mSensor ID ${sensorId} already exists\x1b[0m`);
        return res.status(500).json({ success: false, error: 'A record with the same Sensor ID exists' });
    }
    if (!type) {
        errors.push('type is missing');
    }
    if (!value) {
        errors.push('value is missing');
    }
    else if (isNaN(value) || !Number.isFinite(Number(value))) {
        errors.push('Value must be a numeric value');
    }
    if (!timestamp) {
        errors.push('timestamp is missing');
    }
    else {
        const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        if (!dateRegex.test(timestamp)) {
            errors.push('timestamp must be in the format: yyyy-mm-dd HH:mm:ss');
        }
    }
    if (errors.length > 0) {
        console.error('\x1b[31mValidation errors:\x1b[0m', errors);
        return res.status(400).json({ errors });
    }
    const newSensorData = { sensorId: Number(sensorId), type, value, timestamp };
    sensorData.push(newSensorData);
    fs.writeFile('./data.json', JSON.stringify(sensorData), (err) => {
        if (err) {
            console.error('\x1b[31mError saving data\x1b[0m');
            return res.status(500).json({ success: false, error: 'Error saving data' });
        }
        console.log('\x1b[32mNew sensor data saved successfully:\x1b[0m', newSensorData);
        return res.status(201).json({ success: true, data: newSensorData });
    });
});
app.listen(PORT, () => console.log(`\x1b[36mServer Started at Port ${PORT}\x1b[0m`));
