/** @type {import('next').NextConfig} */
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
};

export default nextConfig;
