/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["pdfkit", "nodemailer"],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allows all domains (remote images only)
      },
    ],

    // ✅ FIX for /api/storage/proxy?key=...
    localPatterns: [
      {
        pathname: "/api/storage/proxy",
        search: "*", 
      },
       {
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
