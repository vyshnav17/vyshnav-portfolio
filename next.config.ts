import type { NextConfig } from "next";

const config: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
  serverExternalPackages: ["cloudflare:workers"],
};

export default config;
