import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { ClientError } from "./errors.js";
import { respondWithError, respondWithJSON } from "./json.js";


export async function handlerUsersCreate(req: Request, res: Response) {
    const email = req.body.email;
    if(!email){
        throw new ClientError('Please enter a valid email')
    }
    const user = await createUser({email: email})
    if(!user){
        throw new Error('Server Error')
    }
    const response = respondWithJSON(res, 201, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email
    })
    return response
}