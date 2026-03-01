import { Hono } from "hono";
import { dataProducts } from "./data";
import { prisma } from "../../lib/prisma";

export const productRoute = new Hono();

productRoute.get("/", async (c) => {
  const allProducts = await prisma.product.findMany();

  return c.json(allProducts);
});

productRoute.get("/:slug", (c) => {
  const slug = c.req.param("slug");

  const product = dataProducts.find((product) => product.slug === slug);

  if (!product) {
    return c.notFound();
  }

  return c.json(product);
});
