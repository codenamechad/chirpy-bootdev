import { loadEnvFile } from 'node:process';
import { MigrationConfig } from 'drizzle-orm/migrator';

loadEnvFile();

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations"
}
type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
}

type Config = {
  api: APIConfig;
  db: DBConfig;
}


type APIConfig = {
  fileServerHits: number;
  platform: string;
  };

export const config: Config=  {
    api: {
      fileServerHits: 0,
      platform: envOrThrow("PLATFORM")
    },
    db: {
      url: envOrThrow("DB_URL"),
      migrationConfig: migrationConfig
    }
    
    
}

export function envOrThrow(key: string){
  const env = process.env[key];
  if(!env){
    throw new Error(`Environment variable ${key} is not set`)
  }
  return env
}