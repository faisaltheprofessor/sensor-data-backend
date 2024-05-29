import express from "express"
import { router } from "./router"
import { PORT } from "./config/appConfig"
import { corsValidator } from "./middlewares/corsValidator"
import { logToFile } from "./utils/logger"
import { logToFileMiddleware } from "./middlewares/logToFile"

const app = express()

// Middleware setup
app.use(corsValidator)
app.use(express.urlencoded({ extended: true }))
app.use(logToFileMiddleware)

// Routes
app.use(router)

// Start the server
app.listen(PORT, () => {
    logToFile(`Server started on port ${PORT}`)
    console.log(`\x1b[32mServer is running on port ${PORT}\x1b[0m`)
})

export default app
