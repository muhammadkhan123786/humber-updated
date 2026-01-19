import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "31.97.115.181",
        port: "8081",
        pathname: "/uploads/**",
      },
    ],
  },
  // images: { 
  //   remotePatterns: [
  //     {
  //       protocol: "http",
  //       hostname: "localhost",
  //       port: "4000",
  //       pathname: "/uploads/**",
  //     },
  //   ],
  // },
  turbopack: {
    resolveAlias: {
      "@common": path.resolve(__dirname, "../common"),
    },
  },
};

export default nextConfig;
