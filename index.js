const express = require('express');
const fs = require('fs');
const cors = require('cors')
const allowedOrigins = require('./allowedOrigins.js');

const app = express();
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}))

app.use(express.urlencoded({ extended: true }));

const PORT = 8000;
let sensorData = [];

// Load existing sensor data from data.json when the server starts
fs.readFile('./data.json', 'utf8', (err, data) => {
    if (err) {
        // Create data.json if it does not exist and add an empty array
        fs.writeFile('./data.json', '[]', (err) => {
            if (err) {
                console.error('Error creating data.json');
            }
        });
    } else {
        sensorData = JSON.parse(data);
    }
});

// GET endpoint to retrieve sensor data with pagination
app.get('/sensors/data', (req, res) => {
    const { page = 1, limit = 10, desc } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let paginatedData = sensorData.slice(startIndex, endIndex);

    if (desc === 'true') {
        paginatedData = paginatedData.reverse();
    }

    // Calculate the next and previous page numbers
    const nextPage = parseInt(page) + 1;
    const prevPage = parseInt(page) - 1;
    const totalPages = Math.ceil(sensorData.length / limit);

    // Create base URL without the limit parameter
    const baseUrl = `${req.protocol}://${req.get('host')}/sensors/data`;
    
    // Create URLs for self, first, last, next, and prev pages
    const selfUrl = `${baseUrl}?page=${page}&desc=${desc || 'false'}`;
    const firstUrl = `${baseUrl}?page=1&desc=${desc || 'false'}`;
    const lastUrl = `${baseUrl}?page=${totalPages}&desc=${desc || 'false'}`;
    const nextUrl = nextPage <= totalPages ? `${baseUrl}?page=${nextPage}&desc=${desc || 'false'}` : null;
    const prevUrl = prevPage > 0 ? `${baseUrl}?page=${prevPage}&desc=${desc || 'false'}` : null;

    // Create the links object with the pagination URLs
    const links = {
        self: selfUrl,
        first: firstUrl,
        last: lastUrl,
        next: nextUrl,
        prev: prevUrl
    };

    res.json({ data: paginatedData, links });
});




// POST endpoint to store sensor data
app.post('/sensors/data', (req, res) => {
    const { sensorId, type, value, timestamp } = req.body;
    const errors = [];
    
    // Validation for sensor ID
    if (!sensorId) {
        errors.push('Sensor ID is missing');
    } else if (isNaN(sensorId) || !Number.isInteger(Number(sensorId))) {
        errors.push('Sensor ID must be an integer');
    } else if (sensorData.some(data => data.sensorId === Number(sensorId))) {
        errors.push('Sensor ID must be unique');
    }
    
    // Other validations
    if (!type) {
        errors.push('Type is missing');
    }
    if (!value) {
        errors.push('Value is missing');
    } else if (isNaN(value) || !Number.isFinite(Number(value))) {
        errors.push('Value must be a numeric value');
    }

// Validation for timestamp (ensure it is in date + time format)
if (!timestamp) {
    errors.push('Timestamp is missing');
} else {
    const dateRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!dateRegex.test(timestamp)) {
        errors.push('Timestamp must be in the format: yyyy-mm-dd HH:mm:ss');
    }
}


    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const newSensorData = { sensorId: Number(sensorId), type, value, timestamp };
    sensorData.push(newSensorData);
    fs.writeFile('./data.json', JSON.stringify(sensorData), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error saving data' });
        }
        return res.status(201).json(newSensorData);
    });
});


app.listen(PORT, () => console.log(`Server Started at Port ${PORT}`));
