import type { Request, Response } from "express";
import { ClientError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { saveChirp } from "src/db/queries/chirps.js";

export async function handlerChirpsCreate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  type NewChirp = {
    body: string;
    userId: string;
  }

  const params: parameters = req.body;
  const userId = req.body.userId; 

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    
    throw new ClientError('Chirp is too long. Max length is 140');
    
   
  }

  const words = params.body.split(" ");

  const badWords = ["kerfuffle", "sharbert", "fornax"];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const loweredWord = word.toLowerCase();
    if (badWords.includes(loweredWord)) {
      words[i] = "****";
    }
  }

  const cleaned = words.join(" ");
  const newChirp = {userId: userId, body: cleaned}
  const result = await saveChirp(newChirp)

  respondWithJSON(res, 201, result);
}
