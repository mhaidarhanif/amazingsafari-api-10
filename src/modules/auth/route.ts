import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import { prisma } from "../../lib/prisma";
import { RegisterUserSchema } from "./schema";
import { UserSchema } from "../user/schema";
import { hashPassword } from "../../lib/hash";

export const authRoute = new OpenAPIHono();

authRoute.openapi(
  createRoute({
    method: "post",
    path: "/register",
    request: {
      body: { content: { "application/json": { schema: RegisterUserSchema } } },
    },
    responses: {
      200: {
        content: { "application/json": { schema: UserSchema } },
        description: "Register new user",
      },
      400: {
        description: "Failed to register new user",
      },
    },
  }),
  async (c) => {
    const validatedBody = c.req.valid("json");

    const newUser = await prisma.user.create({
      data: {
        username: validatedBody.username,
        email: validatedBody.email,
        name: validatedBody.name,
        password: {
          create: {
            hash: await hashPassword(validatedBody.password),
          },
        },
      },
    });

    return c.json(newUser);
  },
);
