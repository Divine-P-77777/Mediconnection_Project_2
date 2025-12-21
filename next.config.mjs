/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['res.cloudinary.com'], 
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'crueywamzqfundowraoc.supabase.co',
          pathname: '/storage/v1/object/public/**',
        },
      ],
    },
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

