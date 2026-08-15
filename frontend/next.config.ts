import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy API requests to Express backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },

  // Allow external images (Unsplash)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Enable React strict mode
  reactStrictMode: true,
};

export default nextConfig;
