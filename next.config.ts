import type { NextConfig } from "next";

// Staging on GitHub Pages is served from /gss-website; production on its own
// domain is served from the root. Set NEXT_PUBLIC_BASE_PATH accordingly.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
