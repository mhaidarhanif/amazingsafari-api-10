import { prisma } from "./lib/prisma";

async function main() {
  try {
    const allAnimals = await prisma.animal.findMany();

    console.log(allAnimals);
  } catch (error) {
    console.error("Failed to create new animal and find animals");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
