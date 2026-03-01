import { Hono } from "hono";

export const commonRoute = new Hono();

commonRoute.get("/", (c) => {
  return c.json({
    title: "Amazing Safari API",
    products: "/products",
  });
});
