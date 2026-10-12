/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'crueywamzqfundowraoc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['recharts'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'mediconnection.vercel.app'],
    },
  },
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  // Configure webpack if needed
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;

