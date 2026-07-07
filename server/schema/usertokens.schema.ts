import z from "zod";

export const UserTokensSchema = z.object({
  token: z.string(),
  userId: z.number(),
  createdAt: z.iso.date(),
  updateAt: z.iso.date(),
  revokedAt: z.iso.date() || z.null(),
});

export type UserTokensSchema = z.infer<typeof UserTokensSchema>;
