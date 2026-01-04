import { Request, Response, NextFunction} from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";
import { HttpError } from "./errors.js";

export async function middlewareLogResponse(req: Request, res: Response, next: NextFunction){
    res.on('finish', () => {
        const statusCode = res.statusCode;
        const url = req.url;
        const method = req.method;

        if(statusCode !== 200){
            console.log(`[NON-OK] ${method} ${url} - Status: ${statusCode}`)
        }
        
    })
    next()
}

export async function middlewareMetricsInc(
  _: Request,
  __: Response,
  next: NextFunction,
) {
  config.api.fileServerHits++;
  next();
}

export async function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
 if(err instanceof HttpError){
  let message = err.message
  let statusCode = err.statusCode
  respondWithError(res, statusCode, message);
 }
 else{
  console.error(err)
  respondWithError(res, 500, "Something went wrong on our end")
 }
}