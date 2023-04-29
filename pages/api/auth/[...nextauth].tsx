import NextAuth, { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';

import { getUserByEmail } from '@/graphql/queries';

import { prisma } from '@/lib/prisma/prismaClient';
import { verifyPassword } from '@/lib/utils/bcrypt';

import { apolloClient } from '@/lib/apollo/apollo';

export let authOptions = {} as AuthOptions;

authOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers

  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),

    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'Email',
        },

        password: {
          label: 'Пароль',
          type: 'password',
          placeholder: 'Пароль',
        },
      },

      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        try {
          if (!credentials || !credentials?.email || !credentials?.password) {
            return null;
          }

          const { data: userData } = await apolloClient.query({
            query: getUserByEmail,
            variables: { email: credentials?.email },
          });

          // console.log(
          //   'cccc',
          //   userData,
          //   userData.getUserByEmail?.password?.password,
          //   credentials.password,
          // );

          if (!userData?.getUserByEmail) {
            return null;
          }

          const result = await verifyPassword({
            password: credentials.password,
            hash: userData.getUserByEmail.password.password,
          });

          // const user = {
          //   id: '1',
          //   name: 'J Smith',
          //   email: 'jsmith@example.com',
          // };
          // console.log(userData.getUserByEmail);
          if (result) {
            // Any object returned will be saved in `user` property of the JWT
            return {
              id: userData.getUserByEmail.id,
              name: userData.getUserByEmail.name,
              email: userData.getUserByEmail.email,
              image: userData.getUserByEmail.image,
              roleId: userData.getUserByEmail.role.id,
              roleName: userData.getUserByEmail.role.name,
            };
            // return userData.getUserByEmail;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error: any) {
          console.log(22, error);
          return null;
          // return { status: 'error', ok: false, message: error?.message };
        }
      },
    }),
  ],

  secret: process.env.SECRET,
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async session({ session, token }) {
      //@ts-ignore
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    newUser: '/auth/newuser',
  },
};

export default NextAuth(authOptions);
