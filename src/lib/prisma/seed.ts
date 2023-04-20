import tools from '../dump-data/toolsData';
import { prisma } from './prismaClient';

const main = async () => {
  console.log(`Start seeding...`);
  await prisma.tool.deleteMany({});
  console.log(`Database was wiped out. Ready to seeding it up.`);

  tools.forEach(async (tool) => {
    await prisma.tool.upsert({
      where: {
        id: tool.id,
      },
      create: tool,
      update: tool,
    });
  });
  console.log(`Database was seeded.`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log(`Database disconnected.`);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    console.log(`Seeding was failed. Error happened.`);
    process.exit(1);
  });
