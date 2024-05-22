# Coding Challenge: Farm Sensor Data API and Visualization

## Objective
Develop a simplified version of a farm sensor data management system that consists of two main parts: A backend API to handle sensor data (e.g., temperature, humidity) and a basic frontend to display this data. Use any backend or frontend framework that you feel comfortable with.

## Backend
### Create a RESTful API with the following endpoints:
`POST` `/sensors/data`: Accepts and stores sensor data (e.g., sensor ID, type, value, timestamp).  
`GET` `/sensors/data`: Retrieves the latest data for all sensors.

### Data Storage:
For simplicity, use an in-memory store or a simple file-based storage solution to persist sensor data.

### Error Handling:
Implement basic error handling for the API endpoints.

## Testing
Write a test to verify the functionality of the API endpoints. 


## Frontend

### Sensor Data Display:
Develop a web application to fetch and display sensor data from the backend in a simple, readable format (e.g. a list or table).

### Sensor Data Input:
Add a functionality to input new sensor data

### Data Refresh:
Implement a mechanism to periodically refresh the sensor data displayed on the frontend, ensuring the latest data is always shown.

## Testing 
Include a basic test for the frontend to check that sensor data is correctly fetched and displayed.

## Submission Guidelines
Provide a zip file containing your project.  
Include a `README` file with setup instructions and a brief explanation of your solution.  
Ensure the application can be easily set up and run locally for evaluation purposes.
