import * as argon2 from "argon2";

export async function hashPassword(plainTextPassword: string) {
  try {
    const hashedPassword = await argon2.hash(plainTextPassword);
    return hashedPassword;
  } catch (error) {
    throw new Error("Failed to hash password");
  }
}

export async function verifyPassword(
  hashedPassword: string,
  plainTextPassword: string,
) {
  try {
    const result = await argon2.verify(hashedPassword, plainTextPassword);
    return result;
  } catch (error) {
    throw new Error("Failed to verify password");
  }
}
