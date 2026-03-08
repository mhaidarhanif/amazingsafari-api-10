import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { Scalar } from "@scalar/hono-api-reference";

import { productRoute } from "./modules/product/route";
import { commonRoute } from "./modules/common/route";

const app = new OpenAPIHono();

app.use(logger());
app.use(cors());

app.route("/", commonRoute);
app.route("/products", productRoute);

// The OpenAPI documentation will be available at /doc
app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Amazing Safari API (Batch 10)",
    version: "1.0.0",
  },
});

app.get("/", Scalar({ url: "/openapi.json" }));

export default app;
