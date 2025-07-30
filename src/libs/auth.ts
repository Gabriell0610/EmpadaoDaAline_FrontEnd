/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';

import { JWT } from 'next-auth/jwt';
import { baseUrl } from '@/utils/helpers';

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
  return data;
};

const refreshAccessToken = async (token: JWT) => {
  try {
    console.log('Entrando no refreshToken', JSON.stringify(token.exp));
    const res = await fetch(`${baseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    if (!res.ok) throw new Error('Erro ao renovar token');

    const data = await res.json();
    const decoded = jwtDecode<JWT>(data.access_token);

    console.log(
      'Novo access_token recebido:',
      JSON.stringify(data.access_token),
    );
    console.log(
      'Decoded exp do novo token:',
      JSON.stringify(new Date(decoded.exp).toLocaleString()),
    );
    console.log('Agora:', JSON.stringify(new Date().toLocaleString()));

    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: token.refreshToken,
      exp: decoded.exp,
    };
  } catch (error) {
    console.error('Erro no refreshAccessToken:', error);
    return { ...token, error: 'RefreshTokenError' } as JWT;
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

        const decoded = jwtDecode<JWT>(res.access_token);
        console.log('Decoded Access Token EXP:', JSON.stringify(decoded.exp));
        console.log(
          'Token expires at:',
          JSON.stringify(new Date(decoded.exp * 1000).toLocaleString()),
        );
        console.log(
          'Current time:',
          JSON.stringify(new Date().toLocaleString()),
        );
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
      const isAccessTokenExpired = Math.floor(Date.now() / 1000) > token.exp;

      console.log('Date.now():', JSON.stringify(Date.now()));
      console.log('Token exp:', token.exp);
      console.log(
        'Token exp (humano):',
        JSON.stringify(new Date(token.exp).toLocaleString()),
      );
      console.log(
        'Access token expired?',
        JSON.stringify(Date.now() > token.exp),
      );
      if (isAccessTokenExpired) {
        try {
          // Verifica se o refreshToken também expirou
          const decodedRefresh = jwtDecode<{ exp: number }>(token.refreshToken);
          const isRefreshTokenExpired =
            Math.floor(Date.now() / 1000) > decodedRefresh.exp;
          if (isRefreshTokenExpired) {
            console.log('refresh token expired');
            return {
              ...token,
              refreshTokenExpired: true,
              accessToken: '',
              exp: 0,
            } as JWT;
          }

          return await refreshAccessToken(token);
        } catch (err) {
          console.error('Erro ao decodificar o refresh token', err);
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
        session.user.refreshTokenExpired = token.refreshTokenExpired;
      }
      (session as any).exp = token.exp;

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
