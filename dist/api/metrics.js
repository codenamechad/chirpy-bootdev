import { config } from "../config.js";
export async function middlewareMetricsLog(req, res) {
    res.send(`Hits: ${config.fileServerHits}`);
}
