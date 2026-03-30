import z from "zod";
import { UserModelSchema } from "../../generated/zod/schemas";

export { UserModelSchema };

export const UserSchema = UserModelSchema.omit({
  password: true,
}).extend({
  username: z.string().openapi({ example: "example" }),
  email: z.string().openapi({ example: "example@example.com" }),
  name: z.string().openapi({ example: "Example" }),
});

export const SeedUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const SeedUsersSchema = SeedUserSchema.array();

export const PublicUserSchema = UserSchema.omit({
  email: true,
});

export const TokenUserSchema = UserSchema.pick({ id: true });

export const UsersSchema = UserSchema.array();
export const PublicUsersSchema = PublicUserSchema.array();

export type User = z.infer<typeof UserSchema>;
export type Users = z.infer<typeof UsersSchema>;

export type PublicUser = z.infer<typeof PublicUserSchema>;
export type PublicUsers = z.infer<typeof PublicUsersSchema>;

export type SeedUser = z.infer<typeof SeedUserSchema>;
export type SeedUsers = z.infer<typeof SeedUsersSchema>;

export type TokenUser = z.infer<typeof TokenUserSchema>;
