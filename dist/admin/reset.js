import { config } from "../config.js";
import { ForbiddenError } from "../api/errors.js";
import { resetUsers } from "../db/queries/reset.js";
export async function handlerReset(req, res) {
    if (config.api.platform !== "dev") {
        throw new ForbiddenError("Invalid Credentials");
    }
    config.api.fileServerHits = 0;
    await resetUsers();
    res.send('Hits reset to 0');
}
