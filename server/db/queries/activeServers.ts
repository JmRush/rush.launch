import { servers } from "../schema";
import { db } from "..";
import { eq } from "drizzle-orm";

export const getActiveServers = async() => {
    //might cut down on what is actually returned by the query
    return await db.select().from(servers).where(eq(servers.status, "active"));
}
