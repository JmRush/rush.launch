import z from "zod";

export const UserRolesSchema = z.object({
  id: z.int(),
  userId: z.number(),
  roleId: z.number(),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
});

export type UserRoles = z.infer<typeof UserRolesSchema>;
