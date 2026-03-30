import z from "zod";
import { UserSchema } from "../user/schema";

export const RegisterUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().openapi({ example: "***" }),
});

export type RegisterUser = z.infer<typeof RegisterUserSchema>;
