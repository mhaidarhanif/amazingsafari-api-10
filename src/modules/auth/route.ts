import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import { prisma } from "../../lib/prisma";
import { RegisterUserSchema } from "./schema";
import { UserSchema } from "../user/schema";

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

    // TODO: Register in database

    return c.json(validatedBody);
  },
);
