import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@supabase/supabase-js'],
  images: {
    domains: [
      'supabase.com',
      'supabase.co',
      'leonardo.ai',
      'cdn.leonardo.ai',
      'lh3.googleusercontent.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.leonardo.ai',
        pathname: '/**',
      }
    ]
  }
};

export default nextConfig;
