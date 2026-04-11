import { db } from "../../db";
import { userTokens } from "../../db/schema";
import { eq } from "drizzle-orm";

export const insertRefreshToken = async (token: string, userId: number) => {
    await db.insert(userTokens).values({
        token: token,
        userId: userId,
    });
}

export const getRefreshToken = async (token: string) => {
    const [result] = await db.select().from(userTokens).where(eq(userTokens.token, token)).limit(1);
    return result;
}