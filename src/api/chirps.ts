import type { Request, Response } from "express";
import { ClientError, NotFoundError } from "./errors.js";
import { respondWithJSON } from "./json.js";
import { createChirp, getChirpById, getChirps } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT  } from "../auth.js";
import { config } from "../config.js";

export async function handlerChirpsCreate(req: Request, res: Response) {
  type parameters = {
    body: string;
    userId: string;
  }; 
  const token = getBearerToken(req);
  const verifiedUser = validateJWT(token, config.jwt.secret)

  const params: parameters = req.body;
  const cleaned = validateChirp(params.body)
  const chirp = await createChirp({body: cleaned, userId: verifiedUser})
  respondWithJSON(res, 201, chirp)
}

  function validateChirp(body: string){
    const maxChirpLength = 140;
    if (body.length > maxChirpLength) {
     throw new ClientError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    return getCleanedBody(body, badWords)
  }


  function getCleanedBody(body: string, badWords: string[]){
  const words = body.split(' ');
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const loweredWord = word.toLowerCase();
    if (badWords.includes(loweredWord)) {
      words[i] = "****";
    }
  }
  const cleaned = words.join(" ");
  return cleaned 
}

export async function handlerGetChirps(req: Request, res: Response){
  const results = await getChirps();
  return respondWithJSON(res, 200, results)
}


export async function handlerGetChirpById(req: Request, res: Response){
    const  { chirpId } = req.params
    const result = await getChirpById(chirpId)
    if(!result){
     throw new NotFoundError('Chirp not found')
    }
    return respondWithJSON(res, 200, result)

}