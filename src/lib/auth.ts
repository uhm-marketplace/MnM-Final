/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */
// src/lib/auth.ts
import { compare } from 'bcrypt';
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt', // Use JSON Web Tokens for session management
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
          where: { email: credentials.email },
        });
      
        if (!user) {
          return null;
        }
      
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }
      
        // Fetch the associated profile
        const profile = await prisma.profile.findUnique({
          where: { email: credentials.email },
        });
      
        return {
          id: `${user.id}`,
          email: user.email,
          role: user.role,
          name: `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim(), // Combines first and last name
          firstName: profile?.firstName,
          lastName: profile?.lastName,
        };        
      },      
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    // Add user details to the session object
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id, // User ID
          profileId: token.profileId, // Profile ID if needed
          randomKey: token.randomKey, // Additional role info
          name: token.name, // User's name
          email: token.email, // User's email
        },
      };
    },
    // Include user fields in the JWT token
    jwt: async ({ token, user }) => {
      if (user) {
        // Extract user fields for inclusion in the JWT
        const u = user as any; // Adjust type as needed for your user object
        return {
          ...token,
          id: u.id, // User ID
          profileId: u.profileId || null, // Include profile ID if present
          randomKey: u.randomKey || null, // Additional user data
          name: u.name || u.username || "", // Name or fallback to username
          email: u.email || "", // Email of the user
        };
      }
      return token;
    },
  },
}  