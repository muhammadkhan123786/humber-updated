import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {},

  webpack: (config) => {
    config.resolve.alias["@common"] = path.resolve(__dirname, "../common");
    return config;
  },
};

export default nextConfig;
