import { db } from "./server/db";
import { users, roles, userRoles } from "./server/db/schema";
import { eq } from "drizzle-orm";

const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
const plainPassword = process.env.ADMIN_PASSWORD ?? "admin";

const [existingRole] = await db.select().from(roles).where(eq(roles.name, "admin")).limit(1);
const adminRole =
  existingRole ??
  (await db.insert(roles).values({ name: "admin" }).returning())[0];

const passwordHash = await Bun.password.hash(plainPassword);

const [user] = await db
  .insert(users)
  .values({
    name: "Admin",
    email,
    password: passwordHash,
  })
  .returning();

await db.insert(userRoles).values({
  userId: user.id,
  roleId: adminRole.id,
});