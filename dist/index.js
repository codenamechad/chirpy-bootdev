import express from "express";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { config } from "./config.js";
import { handlerReadiness } from "./api/readiness.js";
import { errorMiddleware, middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { middlewareMetricsLog } from "./admin/metrics.js";
import { handlerReset } from "./admin/reset.js";
import { handlerChirpsValidate } from "./api/chirp.js";
import { handlerUsersCreate } from "./api/users.js";
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
const app = express();
const PORT = 8080;
app.use('/app', middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponse);
app.use(express.json());
app.get('/admin/metrics', middlewareMetricsLog);
app.post('/admin/reset', handlerReset);
app.post('/api/validate_chirp', (req, res, next) => {
    Promise.resolve(handlerChirpsValidate(req, res)).catch(next);
});
app.post('/api/users', handlerUsersCreate);
app.get("/api/healthz", handlerReadiness);
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
