import express from "express";
import { router } from "./router";
import { PORT } from "./config/appConfig";
import { corsValidator } from "./middlewares/corsValidator";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middleware setup
app.use(corsValidator)
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// Routes
app.use("/", router);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
