import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Alias for common folder
    config.resolve.alias['@common'] = path.resolve(__dirname, '../common');
    return config;
  },
};

export default nextConfig;
