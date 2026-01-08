import type { Request, Response } from "express";
import { createUser, getUserByEmail, updateUserLogin } from "../db/queries/users.js";
import { AuthorizationError, ClientError } from "./errors.js"; // or ClientError if that’s what your project uses
import { respondWithError, respondWithJSON } from "./json.js";
import { checkPasswordHash, getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { NewUser } from "../db/schema.js";
import { config } from "../config.js";

export async function handlerUsersCreate(req: Request, res: Response) {
  const { password, email } = req.body;

  if (!email || !password) {
    throw new ClientError("Missing required fields");
  }

  const hashedPassword = await hashPassword(password);

  const user = await createUser({
    email,
    hashedPassword,
  } satisfies NewUser);

  if (!user) {
    throw new Error("Could not create user");
  }

  return respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}

export async function handlerUpdateLogin(req: Request, res: Response) {
  const accessToken = getBearerToken(req)
  if(!accessToken){
    throw new AuthorizationError('Missing access token')
  }
  const validUser = validateJWT(accessToken, config.jwt.secret)
  if(!validUser){
    throw new AuthorizationError('Invalid user')
  }
  const {email,  password} = req.body
    if (!email || !password) {
    throw new AuthorizationError("Missing required fields");
  }
  const hashed = await hashPassword(password);
  const updatedUser = await updateUserLogin(validUser, email, hashed);
  
  return respondWithJSON(res, 200, {
    id: updatedUser.id,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
    email: updatedUser.email
  })

}