import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  turbopack: {
    resolveAlias: {
      "@common": path.resolve(__dirname, "../common"),
    },
  },
};

export default nextConfig;
