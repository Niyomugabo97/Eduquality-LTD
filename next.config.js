/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: 50 * 1024 * 1024, // 50MB limit for large file uploads
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/drmqxz9cc/**',
      },
    ],
  },
};

module.exports = nextConfig;
