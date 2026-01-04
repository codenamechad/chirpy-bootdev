import { Chirp, chirps } from "../schema";
import { db } from "..";



export async function saveChirp(chirp: Chirp){
   const [result] = await db.insert(chirps).values(chirp).returning();
   return result
}