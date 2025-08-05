/* eslint-disable @typescript-eslint/no-explicit-any */
// authOptions.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import { JWT } from 'next-auth/jwt';
import { baseUrl } from '@/utils/helpers';
import { AccessProfile } from '@/constants/enums/AccessProfile';

const login = async (credentials: any) => {
  const res = await fetch(`${baseUrl()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: credentials?.email,
      password: credentials?.password,
    }),
  });

  if (!res.ok) {
    throw new Error('Email ou senha inválidos');
  }

  const data = await res.json();
  console.log('Resultado do login:', JSON.stringify(data));
  return data;
};

const refreshAccessToken = async (token: JWT) => {
  console.log('Entrando no refreshToken');
  try {
    const res = await fetch(`${baseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    if (!res.ok) throw new Error('Erro ao renovar token');

    const data = await res.json();
    const decoded = jwtDecode<{ exp: number }>(data.access_token);

    console.log(
      'Novo access_token recebido:',
      JSON.stringify(data.access_token),
    );
    console.log(
      'Decoded exp do novo token:',
      JSON.stringify(new Date(decoded.exp * 1000).toLocaleString()),
    );
    console.log('Agora:', JSON.stringify(new Date().toLocaleString()));

    return {
      ...token,
      accessToken: data.access_token,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error('Erro no refreshAccessToken:', JSON.stringify(error));
    return {
      ...token,
      error: 'RefreshTokenError',
      accessToken: '',
      exp: 0,
      refreshTokenExpired: true,
    } as JWT;
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await login(credentials);

        const decoded = jwtDecode<{
          id: string;
          email: string;
          role: AccessProfile;
          exp: number;
        }>(res.access_token);

        return {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          accessToken: res.access_token,
          refreshToken: res.refresh_token,
          exp: decoded.exp,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.exp = user.exp;
      }

      console.log(
        'verificando access_token',
        JSON.stringify(token.accessToken),
      );
      const decoded = jwtDecode<{ exp: number }>(token.accessToken);
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const isAccessTokenExpired = nowInSeconds > decoded.exp;
      console.log(
        'Access token expired?',
        JSON.stringify(isAccessTokenExpired),
      );

      if (isAccessTokenExpired) {
        try {
          const decodedRefresh = jwtDecode<{ exp: number }>(token.refreshToken);
          const isRefreshTokenExpired = nowInSeconds > decodedRefresh.exp;

          if (isRefreshTokenExpired) {
            console.log('Refresh token expired');
            return {
              ...token,
              refreshTokenExpired: true,
              accessToken: '',
              exp: 0,
            } as JWT;
          }

          return await refreshAccessToken(token);
        } catch (err) {
          console.error(
            'Erro ao decodificar o refresh token:',
            JSON.stringify(err),
          );
          return {
            ...token,
            refreshTokenExpired: true,
            accessToken: '',
            exp: 0,
          } as JWT;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.refreshTokenExpired = token.refreshTokenExpired;
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
