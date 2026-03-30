import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import { prisma } from "../../lib/prisma";
import {
  LoginResponseSchema,
  LoginUserSchema,
  RegisterUserSchema,
} from "./schema";
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
    try {
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
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "Failed to register new user",
          error,
        },
        400,
      );
    }
  },
);

authRoute.openapi(
  createRoute({
    method: "post",
    path: "/login",
    request: {
      body: { content: { "application/json": { schema: LoginUserSchema } } },
    },
    responses: {
      200: {
        content: { "application/json": { schema: LoginResponseSchema } },
        description: "Login user",
      },
      400: {
        description: "Failed to login user",
      },
    },
  }),
  async (c) => {
    try {
      const validatedBody = c.req.valid("json");

      const existingUser = await prisma.user.findUnique({
        where: {
          email: validatedBody.email,
        },
        include: {
          password: { select: { hash: true } },
        },
      });

      return c.json({
        token: "",
        user: existingUser,
      });
    } catch (error) {
      console.error(error);
      return c.json(
        {
          message: "Failed to login new user",
          error,
        },
        400,
      );
    }
  },
);
