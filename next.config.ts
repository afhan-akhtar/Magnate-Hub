import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',

  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "magnatehub.au",
        port: "",
        pathname: "/uploads/project/card/**",
      },
    ],
  },
} as NextConfig;

export default nextConfig;