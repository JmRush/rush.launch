import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result;
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const result = await db
    .insert(users)
    .values({ name, email, password })
    .returning();
  return result[0];
};
