import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import { dataProducts } from "./data";
import { prisma } from "../../lib/prisma";
import { ProductsSchema } from "./schema";

export const productRoute = new OpenAPIHono();

productRoute.openapi(
  createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        content: { "application/json": { schema: ProductsSchema } },
        description: "Get all products",
      },
    },
  }),
  async (c) => {
    const products = await prisma.product.findMany();

    return c.json(products);
  },
);

// productRoute.get("/:slug", (c) => {
//   const slug = c.req.param("slug");

//   const product = dataProducts.find((product) => product.slug === slug);

//   if (!product) {
//     return c.notFound();
//   }

//   return c.json(product);
// });
