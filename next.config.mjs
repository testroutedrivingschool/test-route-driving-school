/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   compiler:{
    removeConsole:process.env.NODE_ENV === "production"
   },
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
