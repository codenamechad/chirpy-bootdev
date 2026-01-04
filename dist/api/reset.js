import { config } from "../config.js";
export async function resetServerHits(req, res) {
    config.fileServerHits = 0;
    res.send('Hits reset to 0');
}
