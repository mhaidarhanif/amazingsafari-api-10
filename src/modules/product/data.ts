type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
type Products = Product[];

type SeedProduct = Omit<Product, "id" | "createdAt" | "updatedAt">;
type SeedProducts = SeedProduct[];

export const dataProducts: SeedProducts = [
  {
    slug: "bear-plush",
    name: "Bear Plush",
    sku: "AS-001",
    price: 100000,
    stockQuantity: 100,
    imageUrl: "https://example.com/produt-1.jpg",
    description: "Bear Plush is a type of animal that lives in the savannah.",
  },
];
