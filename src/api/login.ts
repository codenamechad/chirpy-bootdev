import type { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { AuthorizationError, ClientError } from "./errors.js";
import { checkPasswordHash } from "../auth.js";
import { respondWithJSON } from "./json.js";

export async function handlerLogin(req: Request, res: Response) {
  const { password, email } = req.body;

  if (!email || !password) {
    throw new ClientError("Missing required fields");
  }

  const user = await getUserByEmail(email);

  if (!user) {
    throw new AuthorizationError("Incorrect email or password");
  }

  const ok = await checkPasswordHash(password, user.hashedPassword);
  if (!ok) {
    throw new AuthorizationError("Incorrect email or password");
  }

  return respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}