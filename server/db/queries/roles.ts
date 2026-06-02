import { db } from "../../db";
import { users, roles, userRoles, Role, User } from "../../db/schema";
import { eq } from "drizzle-orm";
export const getUserAndRoles = async (email: string) => {
    //query db to get user and their roles combined using the joining table for roles and users
    const userAndRoles = db
    .select({id: users.id, name: users.name, email: users.email, password: users.password, role: roles.name})
    .from(users)
    .innerJoin(userRoles, eq(users.id, userRoles.userId))
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(users.email, email)).limit(1);
    return userAndRoles;
}

export const getUserAndRolesById = async (userId: number) => {
    const userAndRoles = db
    .select({id: users.id, email: users.email, name: users.name, role: roles.name})
    .from(users)
    .innerJoin(userRoles, eq(users.id, userRoles.userId))
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(users.id, userId)).limit(1);
    return userAndRoles;
}
