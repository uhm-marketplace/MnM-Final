/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */
import { compare } from 'bcrypt';
import type { AuthOptions } from 'next-auth/core/types';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'john@foo.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: `${user.id}`,
          email: user.email,
          randomKey: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      const updatedSession = { ...session };
      if (updatedSession.user) {
        updatedSession.user = {
          ...updatedSession.user,
          id: user.id,
        };
      }
      return {
        ...updatedSession,
        user: {
          ...updatedSession.user,
          randomKey: user.randomKey,
        },
      };
    },
    jwt: ({ token, user }: { token: any; user?: any }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
};
