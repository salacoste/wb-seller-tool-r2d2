import { ApolloServer } from '@apollo/server';
import { typeDefs } from '@/graphql/schema';
import { resolvers } from '@/graphql/resolvers';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma/prismaClient';

import { IContext } from '@/graphql/types';

import { startServerAndCreateNextHandler } from '@as-integrations/next';
import contextCreator from '@/graphql/context';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(server, {
  context: contextCreator,
});
