import { Request, Response, NextFunction } from "express"
import { logToFile } from "../utils/logger"

export const logToFileMiddleware = (req: Request, res: Response, next: NextFunction) => {
    logToFile(`${req.method} ${req.url}, ${req.get('origin')}, body: ${JSON.stringify(req.body)}`)
    next()
}
