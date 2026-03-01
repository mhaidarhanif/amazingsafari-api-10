import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { productRoute } from "./modules/product/route";
import { commonRoute } from "./modules/common/route";

const app = new Hono();

app.use(logger());
app.use(cors());

app.route("/", commonRoute);
app.route("/products", productRoute);

export default app;
