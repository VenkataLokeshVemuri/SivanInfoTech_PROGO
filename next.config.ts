import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint during production builds. We still recommend running lint locally.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Keep default TypeScript checks; enable ignoreBuildErrors only if you want to skip type errors too.
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
