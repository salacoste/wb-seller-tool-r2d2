import tools from '../dump-data/toolsData';
import { seedAuthTokenData } from '../dump-data/authTokenData';
import {
  seedUserData,
  seedPasswordData,
  seedRolesData,
} from '../dump-data/userPasswordData';

import bcrypt from 'bcrypt';

import { prisma } from './prismaClient';

const saltRounds = 10;

const main = async () => {
  console.log(`Start seeding...`);
  await prisma.tool.deleteMany({});
  console.log(`Tool table was wiped out. Ready to seeding it up.`);

  tools.forEach(async (tool) => {
    await prisma.tool.upsert({
      where: {
        id: tool.id,
      },
      create: tool,
      update: tool,
    });
  });
  console.log(`Tool table was seeded.`);

  console.log(`Start seeding AuthTokens...`);
  await prisma.authToken.deleteMany({});
  console.log(`Table authTokens was wiped out. Ready to seeding it up.`);

  seedAuthTokenData.forEach(async (authToken) => {
    await prisma.authToken.upsert({
      where: {
        id: authToken.id,
      },
      create: authToken,
      update: authToken,
    });
  });
  console.log(`AuthToken table was seeded.`);

  console.log(`Start seeding User Data...`);
  await prisma.user.deleteMany({});
  console.log(`Table User was wiped out. Ready to seeding it up.`);

  seedUserData.forEach(async (user, i) => {
    try {
      let hashPassword = await bcrypt.hash(
        seedPasswordData[i].password,
        saltRounds,
      );
      await prisma.user.upsert({
        include: {
          password: true,
          role: true,
        },
        where: {
          id: user.id,
        },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          // roleId: user.roleId as unknown as undefined,
          password: {
            connectOrCreate: {
              create: {
                password: hashPassword,
              },
              where: {
                userId: user.id,
              },
            },
          },
          role: {
            connectOrCreate: {
              create: {
                id: seedRolesData[i].id,
                name: seedRolesData[i].name,
                description: seedRolesData[i].description,
              },
              where: {
                id: user.roleId,
              },
            },
          },
        },
        update: {
          id: user.id,
          name: user.name,
          email: user.email,
          // roleId: user.roleId as unknown as undefined,
          password: {
            connectOrCreate: {
              create: {
                password: hashPassword,
              },
              where: {
                userId: user.id,
              },
            },
          },
          role: {
            connectOrCreate: {
              create: {
                id: seedRolesData[i].id,
                name: seedRolesData[i].name,
                description: seedRolesData[i].description,
              },
              where: {
                id: user.roleId,
              },
            },
          },
        },
      });
    } catch (error: any) {
      throw new Error(error);
      console.log(error);
    }
  });
  console.log(`User table was seeded.`);

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
