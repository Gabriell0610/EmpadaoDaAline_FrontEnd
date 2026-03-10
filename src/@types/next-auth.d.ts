/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: AccessProfile;
      accessToken: string;
      refreshToken: string;
      refreshTokenExpired: boolean;
    };
    exp: number;
  }

  interface User {
    id: string;
    email: string;
    role: AccessProfile;
    accessToken: string;
    refreshToken: string;
    exp: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role: AccessProfile;
    accessToken: string;
    refreshToken: string;
    refreshTokenExpired: boolean;
    exp: number;
  }
}
