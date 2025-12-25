// app/robots.ts
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/user/','/admin/', '/doctor/', '/healthcenter/', '/api/', '/_next/'],
      },
    ],
    sitemap: 'https://mediconnection.vercel.app/sitemap.xml',
  };
}
