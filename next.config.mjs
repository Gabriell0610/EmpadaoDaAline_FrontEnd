/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

const cspValue = isDev
  ? ''
  : [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://use.typekit.net",
      "img-src 'self' data: https://yfgbaqkohcpgvplginjy.supabase.co",
      "font-src 'self' data: https://fonts.gstatic.com https://use.typekit.net",
      `connect-src 'self' https://yfgbaqkohcpgvplginjy.supabase.co https://viacep.com.br ${process.env.NEXT_PUBLIC_BASE_URL} ${process.env.NEXT_PUBLIC_BASE_URL_SCOKET?.replace('https://', 'wss://')}`,
    ].join('; ');

const nextConfig = {
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yfgbaqkohcpgvplginjy.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          ...(cspValue
            ? [{ key: 'Content-Security-Policy', value: cspValue }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
