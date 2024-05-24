import { Request, Response, NextFunction } from "express"
import { allowedOrigins } from "../config/appConfig"

export const corsValidator = (req: Request, res: Response, next: NextFunction) => {
    const requestOrigin = req.get("origin")

    if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        res.header("Access-Control-Allow-Origin", requestOrigin)
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        next()
    } else {
        res.status(403).json({ error: "Not allowed by CORS" })
    }
}
