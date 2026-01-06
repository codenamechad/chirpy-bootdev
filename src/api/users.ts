import type { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { ClientError } from "./errors.js"; // or ClientError if that’s what your project uses
import { respondWithJSON } from "./json.js";
import { hashPassword } from "../auth.js";
import { NewUser } from "../db/schema.js";

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