// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['res.cloudinary.com'], // Add your Cloudinary domain
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
<<<<<<< HEAD
  
=======
  
>>>>>>> 238faa33d0fd148c5a7fcc4412722e26108d2e7f
