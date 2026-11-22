import type { NextConfig } from "next";
import path from "node:path";

// PREVIEW_EXPORT=1 builds a static copy (out-preview/) for hosting as a shareable preview.
const isPreviewExport = process.env.PREVIEW_EXPORT === "1";

const nextConfig: NextConfig = {
  cacheComponents: !isPreviewExport,
  partialPrefetching: !isPreviewExport,
  reactStrictMode: true,
  poweredByHeader: false,
  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src/styles")],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    unoptimized: isPreviewExport,
  },
  ...(isPreviewExport && {
    output: "export",
    distDir: ".next-preview",
    trailingSlash: true,
    assetPrefix: "/__ROOT__",
  }),
};

export default nextConfig;
