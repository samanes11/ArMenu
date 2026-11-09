import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion/react"],
    serverActions: { bodySizeLimit: "50mb" },
    middlewareClientMaxBodySize: "50mb",
    staleTimes: { dynamic: 900, static: 900 },
  },
};

export default nextConfig;
