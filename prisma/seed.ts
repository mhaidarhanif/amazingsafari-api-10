import { prisma } from "../src/lib/prisma";
import { dataProducts } from "../src/modules/product/data";

async function main() {
  for (const seedProduct of dataProducts) {
    const product = await prisma.product.upsert({
      where: { slug: seedProduct.slug },
      update: seedProduct,
      create: seedProduct,
    });

    console.log(`🧸 ${product.name}`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
