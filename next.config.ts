import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.firefly.oopoll.com",
      },
    ],
  },
};

export default nextConfig;
