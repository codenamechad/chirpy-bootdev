import { db } from "../index.js";
import { refreshTokens, users } from "../schema.js";
import { eq, isNull, gt, and} from "drizzle-orm";


export async function saveRefreshToken(userId: string, refreshToken: string){
    const now = new Date()
    const [result] = await db.insert(refreshTokens).values({
        token: refreshToken,
        userId: userId,
        expiresAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        revokedAt: null,
    }).returning()

    return result
}

export async function userForRefreshToken(token: string) {
    const [result] = await db.select({user: users}).from(users).innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
    .where(
        and(
            eq(refreshTokens.token, token),
            isNull(refreshTokens.revokedAt),
            gt(refreshTokens.expiresAt, new Date())

        ),
    )
    .limit(1)

    return result
}
export async function revokeRefreshToken(token: string) {
  const rows = await db
  .update(refreshTokens)
  .set({
    revokedAt: new Date()
  })
  .where(
    eq(refreshTokens.token, token)
  )
  .returning();
    if (rows.length === 0) {
    throw new Error("Couldn't revoke token");
  }
}
