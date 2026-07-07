import z from "zod";

export const RolesSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
});
