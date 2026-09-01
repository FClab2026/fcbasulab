import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
