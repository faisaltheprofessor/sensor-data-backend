# Farm Sensor Data API

## Setup
To set up the project, follow these steps inside the project root:
```bash
npm install
```
To run the server, use:
```bash
npm run dev
```
the server will run on port `8000`. You can change the port in `src/config/appConfig.ts`

## API Endpoints
### Getting Data
* `GET` `/sensors/data`: Retrieves the latest data for all sensors.
```bash
curl --location 'localhost:8000/sensors/data'
```
* `POST` `/sensors/data`: Accepts and stores sensor data (sensorId, type, value, timestamp).
```bash 
curl --location 'localhost:8000/sensors/data' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'sensorId=255' \
--data-urlencode 'type=Temprature' \
--data-urlencode 'value=24' \
--data-urlencode 'timestamp=2024-05-27 11:21:00'
```

To enable CORS when using a browser and the address is not `http://localhost:3000`, add the specific origin to the CORS configuration in `src/config/appConfig.ts`.

### Data Storage:
Data will be stored in `data.json`


## Testing
Ensure that the server is running, or the API endpoint tests will fail. Use the following command to run tests:
```bash
npm test 
```
or
```bash
npm t 
```