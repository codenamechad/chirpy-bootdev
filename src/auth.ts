import * as argon2 from "argon2"
import { AuthorizationError, ClientError } from "./api/errors.js"
import jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken";
import e, { Request } from "express";


type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;




export async function hashPassword(password: string): Promise<string>{
    const hash = await argon2.hash(password)
    return hash
}


export async function checkPasswordHash(password: string, hash: string):Promise<boolean>{
    const isPassword = await argon2.verify(hash, password)
    return isPassword
}




export function makeJWT(userID: string, expiresIn: number, secret: string): string{
    const iat = Math.floor(Date.now() / 1000)
    
    const jwtPayload: payload =  {
    iss: "chirpy",
    sub: userID,
    iat: iat,
    exp: iat + expiresIn
}
    const token = jwt.sign(jwtPayload, secret)
    return token
}


export function validateJWT(tokenString: string, secret: string): string{
      try {
    const decoded = jwt.verify(tokenString, secret);
     if (typeof decoded === "object" && decoded !== null) {
        if(typeof decoded.sub === "string" && decoded.iss === "chirpy"){
            return decoded.sub
        }
        else{
            throw new AuthorizationError('Invalid JWT')
        }
}
    throw new AuthorizationError('Invalid JWT')
  } catch (err) {
    throw new AuthorizationError('Invalid or expired JWT')
  }
}


export function getBearerToken(req: Request): string{
    const header = req.get("Authorization");
    if(!header){
        throw new ClientError('Missing Authorization headers')
    }
    const trimmed = header.trim()
    const splitHeader = trimmed.split(' ')
    const filtered = splitHeader.filter(el => el !== "")
    if(filtered.length < 2 || filtered[0] !== "Bearer"){
        throw new AuthorizationError('Invalid token')
    }
    return filtered[1] 
}