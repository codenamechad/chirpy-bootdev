import * as argon2 from "argon2"
import { AuthorizationError } from "./api/errors.js"
import jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken";


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
