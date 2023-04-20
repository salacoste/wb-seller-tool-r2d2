import { PrismaClient } from '@prisma/client';

export declare interface IContext {
  test?: string;
  id?: number;
  prisma: PrismaClient;
}

declare type ITool = {
  name?: string;
  url?: string;
};
