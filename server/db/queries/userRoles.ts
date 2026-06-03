import { db } from "../../db";
import { userRoles, users } from "../../db/schema";
import { InternalServerError } from "../../types/types_error";

//transaction to create user role, when user is created and role is assigned
export const transactionCreateUserRole = async (name: string, email: string, hashedPassword: string, roleId: number) => {
    const user = await db.transaction(async (tx) => {
        const userCreated = await tx.insert(users).values({ name, email, password: hashedPassword }).returning();
        if(!user) {
            throw new InternalServerError("Failed to create user");
        }
        const userRole = await tx.insert(userRoles).values({ userId: userCreated[0].id, roleId }).returning();
        if(!userRole) {
            throw new InternalServerError("Failed to create user role");
        }
        return userCreated[0];
    });
    return user;
}