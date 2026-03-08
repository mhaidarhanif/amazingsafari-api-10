import z from "zod";
import { ProductModelSchema } from "../../generated/zod/schemas";

export const ProductSchema = ProductModelSchema;

export const ProductsSchema = ProductSchema.array();

export type Product = z.infer<typeof ProductSchema>;
export type Products = z.infer<typeof ProductsSchema>;
