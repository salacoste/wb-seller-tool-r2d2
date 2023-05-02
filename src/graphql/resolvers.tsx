import { Tool } from '@/lib/dump-data/types';
import { prisma } from '@/lib/prisma/prismaClient';
import tools from '../lib/dump-data/toolsData';
import { IContext } from './types';
import { randomUUID } from 'crypto';

export const resolvers = {
  Query: {
    getId: (parent: unknown, args: {}, context: IContext, info: {}) => {
      return context.id;
    },
    getTools: async (
      parent: unknown,
      args: {},
      context: IContext,
      info: {},
    ) => {
      const tools = await context.prisma.tool.findMany({});
      return tools;
    },
    getTool: async (
      parent: unknown,
      args: { id: string | number },
      context: IContext,
      info: {},
    ) => {
      if (typeof args.id === 'string') {
        args.id = Number(args.id);
      }
      const tools = await prisma.tool.findUnique({
        where: { id: args.id },
      });
      return tools;
    },
    // AuthToken getters
    getAuthTokens: async (
      parent: unknown,
      args: { id: string },
      context: IContext,
      info: {},
    ) => {
      return await context.prisma.authToken.findMany({});
    },
    getAuthToken: async (
      parent: unknown,
      args: { token: string },
      context: IContext,
      info: {},
    ) => {
      // console.log('token', args.token);
      return await context.prisma.authToken.findUnique({
        where: { token: args.token },
      });
    },
    getUsers: async (
      parent: unknown,
      args: {},
      context: IContext,
      info: {},
    ) => {
      return await context.prisma.user.findMany({
        include: { password: true, company: true, role: true },
      });
    },
    getUser: async (
      parent: unknown,
      args: { id: string },
      context: IContext,
      info: {},
    ) => {
      return await context.prisma.user.findUnique({
        where: { id: args.id },
        include: { password: true, company: true, role: true },
      });
    },
    getUserByEmail: async (
      parent: unknown,
      args: { email: string },
      context: IContext,
      info: {},
    ) => {
      return await context.prisma.user.findUnique({
        where: { email: args.email },
        include: { password: true, company: true, role: true },
      });
    },
  },
  Mutation: {
    addTool: async (
      parent: unknown,
      args: { name: string; link: string; description: string; image: string },
      context: IContext,
      info: {},
    ): Promise<Tool> => {
      const tools = await prisma.tool.findMany({});
      const newTool = {
        id: tools.length + 1,
        name: args.name,
        description: args.description,
        link: args.link,
        image: args.image,
      };
      const obj = await prisma.tool.create({ data: newTool });
      return obj;
    },
    deleteTool: async (
      parent: unknown,
      args: { id: string | number },
      context: IContext,
      info: {},
    ) => {
      if (typeof args.id === 'string') {
        args.id = Number(args.id);
      }
      let tool: Tool | null | { message: string };
      tool = await prisma.tool.delete({ where: { id: args.id } });
      return tool;
    },
    updateTool: async (
      parent: unknown,
      args: {
        id: string | number;
        name: string;
        link: string;
        description: string;
        image: string;
      },
      context: IContext,
      info: {},
    ) => {
      if (typeof args.id === 'string') {
        args.id = Number(args.id);
      }

      let tool: Tool;
      tool = await prisma.tool.update({
        where: { id: args.id },
        data: {
          name: args.name,
          description: args.description,
          link: args.link,
          image: args.image,
        },
      });
      return tool;
    },
    createUser: async (
      parent: unknown,
      args: {
        name: string;
        email: string;
        password: string;
        image?: string;
        role: string;
        roleDescription?: string;
        companyId: string;
      },
      context: IContext,
      info: {},
    ) => {
      const user = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          image: args.image,
          password: {
            create: {
              password: args.password,
              //email: args.email,
            },
          },
          company: {
            connect: {
              id: args.companyId,
            },
          },
          role: {
            create: {
              name: args.name,
              description: args.roleDescription,
              id: randomUUID(),
            },
          },
        },
        include: {
          password: true, // Return all fields
          role: true,
        },
      });
      return user;
    },
  },
};

export default resolvers;
