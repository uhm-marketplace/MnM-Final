import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string; // Add the id field
  }

  interface Session {
    user: User; // Use the extended User type in the session
  }
}
