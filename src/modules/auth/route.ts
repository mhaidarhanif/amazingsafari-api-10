import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import { prisma } from "../../lib/prisma";
import {
  LoginResponseSchema,
  LoginUserSchema,
  RegisterUserSchema,
} from "./schema";
import { UserSchema } from "../user/schema";
import { hashPassword, verifyPassword } from "../../lib/hash";
import { signToken } from "../../lib/token";
import { checkAuthMiddleware } from "./middleware";

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

      if (!existingUser?.password) {
        return c.json(
          {
            message: "Failed to login. User has no password.",
          },
          400,
        );
      }

      const isPasswordVerified = await verifyPassword(
        existingUser?.password.hash,
        validatedBody.password,
      );

      if (!isPasswordVerified) {
        return c.json(
          {
            message: "Failed to login. Password is wrong.",
          },
          400,
        );
      }

      console.log({ existingUser });

      const token = signToken({ id: existingUser.id });

      const loginResponse = {
        token,
        user: {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
          name: existingUser.name,
        },
      };

      return c.json(loginResponse);
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

authRoute.openapi(
  createRoute({
    method: "get",
    path: "/me",
    middleware: checkAuthMiddleware,
    responses: {
      200: {
        content: { "application/json": { schema: UserSchema } },
        description: "Get authenticated user",
      },
      400: {
        description: "Failed to get authenticated user",
      },
    },
  }),
  async (c) => {
    try {
      const user = c.get("user");

      return c.json(user);
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
