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

type APIConfig = {
  fileServerHits: number;
  platform: string;
  secret: string;
  };

type JWTConfig ={
  defaultDuration:number;
  secret: string;
  issuer: string;
}

type Config = {
  api: APIConfig;
  db: DBConfig;
  jwt: JWTConfig;
}




export const config: Config=  {
    api: {
      fileServerHits: 0,
      platform: envOrThrow("PLATFORM"),
      secret: envOrThrow("SECRET")
    },
    db: {
      url: envOrThrow("DB_URL"),
      migrationConfig: migrationConfig
    },
    jwt: {
      defaultDuration: 3600,
      secret: envOrThrow("SECRET"),
      issuer: "chirpy"
    }
    
    
}

export function envOrThrow(key: string){
  const env = process.env[key];
  if(!env){
    throw new Error(`Environment variable ${key} is not set`)
  }
  return env
}