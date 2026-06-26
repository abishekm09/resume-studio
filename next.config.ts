import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // @react-pdf/renderer ships untranspiled ESM that Next needs to process.
  transpilePackages: ["@react-pdf/renderer"],
};

export default nextConfig;
