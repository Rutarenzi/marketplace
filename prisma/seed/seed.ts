// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   const product = await prisma.product.upsert({
//     where: { title: "Jordan " },
//     update: {},
//     create: {
//       title: "Jordan 23",
//       description: "best shoes",
//       price: 234,
//     },
//   });
//   console.log(product);
// }

// main()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
