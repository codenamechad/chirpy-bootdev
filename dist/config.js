import { loadEnvFile } from 'node:process';
loadEnvFile();
const migrationConfig = {
    migrationsFolder: "./src/db/migrations"
};
export const config = {
    api: {
        fileServerHits: 0,
        platform: envOrThrow("PLATFORM")
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig
    }
};
export function envOrThrow(key) {
    const env = process.env[key];
    if (!env) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return env;
}
