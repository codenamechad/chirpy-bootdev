import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import { userForRefreshToken } from "../db/queries/refresh.js";
import { AuthorizationError } from "./errors.js";
import { config } from "../config.js";
import { respondWithJSON } from "./json.js";
import { revokeRefreshToken } from "../db/queries/refresh.js";


export async function handlerRefresh(req: Request, res: Response){
    const refreshToken = getBearerToken(req)
    const result = await userForRefreshToken(refreshToken) 

    if(!result){
        throw new AuthorizationError('Invalid refresh token')
    }

    const user = result.user
    const accessToken = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);

    respondWithJSON(res, 200, {
    token: accessToken,
  });
}

export async function handlerRevoke(req: Request, res: Response){
     const refreshToken = getBearerToken(req);
  await revokeRefreshToken(refreshToken);
  res.status(204).send();
}