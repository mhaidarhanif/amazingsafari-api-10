import z from "zod";
import { UserSchema } from "../user/schema";

export const RegisterUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().openapi({ example: "exampleexampleexample" }),
});

export const LoginUserSchema = RegisterUserSchema.omit({
  username: true,
  name: true,
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema.pick({
    id: true,
    username: true,
    email: true,
    name: true,
  }),
});

export type RegisterUser = z.infer<typeof RegisterUserSchema>;
export type LoginUser = z.infer<typeof LoginUserSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
