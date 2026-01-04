import { db } from "../index.js";
import { users } from "../schema.js";
export async function resetUsers() {
    const result = await db.delete(users);
    return result;
}
