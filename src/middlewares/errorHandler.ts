import { Request, Response, NextFunction } from "express";

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error("An error occurred:", err);

    // Handle different types of errors and send appropriate responses
    if (err.name === 'ValidationError') {
        res.status(400).json({ error: err.message });
    } else {
        res.status(500).json({ error: "Internal server error" });
    }
};
