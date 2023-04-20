import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma/prismaClient';
import { IContext } from './types';
import { NextApiRequest, NextApiResponse } from 'next';

export const contextCreator = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<{ prisma: PrismaClient }> => {
  return {
    prisma,
  };
};

export default contextCreator;
