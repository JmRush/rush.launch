import z from "zod";

//main schema
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
});

//Derived
export const CreateUserSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
});
export const LoginUserSchema = UserSchema.pick({ email: true, password: true });

export type UserSchema = z.infer<typeof UserSchema>;
export type CreateUserSchema = z.infer<typeof CreateUserSchema>;
export type LoginUserSchema = z.infer<typeof LoginUserSchema>;
