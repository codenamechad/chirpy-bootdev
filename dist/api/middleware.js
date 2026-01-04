import { config } from "../config.js";
import { respondWithError } from "./json.js";
import { HttpError } from "./errors.js";
export async function middlewareLogResponse(req, res, next) {
    res.on('finish', () => {
        const statusCode = res.statusCode;
        const url = req.url;
        const method = req.method;
        if (statusCode !== 200) {
            console.log(`[NON-OK] ${method} ${url} - Status: ${statusCode}`);
        }
    });
    next();
}
export async function middlewareMetricsInc(_, __, next) {
    config.api.fileServerHits++;
    next();
}
export async function errorMiddleware(err, req, res, next) {
    if (err instanceof HttpError) {
        let message = err.message;
        let statusCode = err.statusCode;
        respondWithError(res, statusCode, message);
    }
    else {
        console.error(err);
        respondWithError(res, 500, "Something went wrong on our end");
    }
}
