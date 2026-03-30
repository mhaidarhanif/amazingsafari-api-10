import { createFactory } from "hono/factory";
import z from "zod";

import { UserSchema } from "../user/schema";
import { verifyToken } from "../../lib/token";
import { prisma } from "../../lib/prisma";

export const AuthMiddlewareEnvSchema = z.object({
  Variables: z.object({
    user: UserSchema,
  }),
});

type AuthMiddlewareEnv = z.infer<typeof AuthMiddlewareEnvSchema>;

/**
 * Check for header and token
 *
 * Authorization: Bearer <token>
 */

const factory = createFactory<AuthMiddlewareEnv>();

export const checkAuthMiddleware = factory.createMiddleware(async (c, next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ message: "Authorization header is required" }, 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return c.json({ message: "Token is required" }, 401);
    }

    const payload = verifyToken(token);
    if (!payload) {
      return c.json({ message: "Invalid token" }, 401);
    }

    if (!payload.sub || typeof payload.sub !== "string") {
      return c.json({ message: "Token user ID is invalid" }, 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      return c.json({ message: "User is no longer available" }, 401);
    }

    c.set("user", user);

    await next();
  } catch (error) {
    console.error(error);
    return c.json(
      {
        message: "Failed to check authorized user",
        error,
      },
      401,
    );
  }
});
