import tools from '../dump-data/toolsData';
import { seedAuthTokenData } from '../dump-data/authTokenData';
import { seedCompanyData } from '../dump-data/companyData';
import {
  seedUserData,
  seedPasswordData,
  seedRolesData,
} from '../dump-data/userPasswordData';

import bcrypt from 'bcryptjs';

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

  console.log(`Start seeding Company Data...`);
  await prisma.company.deleteMany({});
  console.log(`Table Company was wiped out. Ready to seeding it up.`);

  await seedCompanyData.forEach(async (company, i) => {
    try {
      await prisma.company.upsert({
        where: {
          id: company.id,
        },
        create: {
          id: company.id,
          name: company.name,
          description: company.description,
          WILDAUTHNEWV3: company.WILDAUTHNEWV3,
          WBTOKEN: company.WBTOKEN,
          BasketUID: company.BasketUID,
          XSupplierId: company.XSupplierId,
          XSupplierIdExternal: company.XSupplierIdExternal,
          WB_TOKEN: company.WB_TOKEN,
          seeded: company.seeded,
        },
        update: {
          id: company.id,
          name: company.name,
          description: company.description,
          WILDAUTHNEWV3: company.WILDAUTHNEWV3,
          WBTOKEN: company.WBTOKEN,
          BasketUID: company.BasketUID,
          XSupplierId: company.XSupplierId,
          XSupplierIdExternal: company.XSupplierIdExternal,
          WB_TOKEN: company.WB_TOKEN,
          seeded: company.seeded,
        },
      });
      console.info(412, await prisma.company.findMany({}));
    } catch (error) {
      console.log(error);
    }
  });

  console.log(`Company table was seeded.`);
  console.info(11, await prisma.company.findMany({}));

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
          company: true,
        },
        where: {
          id: user.id,
        },
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          company: {
            connect: {
              id: user.companyId,
            },
          },
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
          image: user.image,
          // companyId: user.companyId,
          // roleId: user.roleId as unknown as undefined,
          company: {
            connectOrCreate: {
              create: {
                ...seedCompanyData[0],
              },
              where: {
                id: user.companyId,
              },
            },
          },
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
