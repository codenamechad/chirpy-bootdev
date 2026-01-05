import { NewChirp, chirps } from "../schema.js";
import { db } from "../index.js";
import { eq } from "drizzle-orm";



export async function createChirp(chirp: NewChirp){
   const [result] = await db.insert(chirps).values(chirp).returning();
   return result
}

export async function getChirps(){
   const results = await db.select().from(chirps).orderBy(chirps.createdAt)
   return results
}

export async function getChirpById(chirpId: string){
   const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
   return result
}