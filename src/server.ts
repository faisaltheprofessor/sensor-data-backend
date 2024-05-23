// Import the necessary modules
import express from "express"
import cors from "cors"
import { router } from "./router"
import { PORT, allowedOrigins } from "./config/app"

// Create an instance of the Express application
const app = express()

// Enable CORS with custom origin validation
app.use(
  cors({
    origin(requestOrigin, callback) {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
  })
)

// Middleware setup
app.use(express.json()) // Parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded data

// Configure routes using the defined router
app.use("/", router)

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
