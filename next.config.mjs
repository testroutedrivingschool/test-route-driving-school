/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allows all domains
      },
    ],
  
  },
};

export default nextConfig;
