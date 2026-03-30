import z from "zod";
import { UserModelSchema } from "../../generated/zod/schemas";

export const UserSchema = UserModelSchema.omit({
  password: true,
});

export const UsersSchema = UserSchema.array();

export type User = z.infer<typeof UserSchema>;
export type Users = z.infer<typeof UsersSchema>;

export const SeedUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const SeedUsersSchema = SeedUserSchema.array();

export type SeedUser = z.infer<typeof SeedUserSchema>;
export type SeedUsers = z.infer<typeof SeedUsersSchema>;
