import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip ESLint during production builds. We still recommend running lint locally.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Server-side rewrite: proxy any /api/* request to the private backend running on localhost:8000
  // This keeps the backend private (bind gunicorn to 127.0.0.1:8000) while exposing the frontend publicly.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',
      },
    ];
  },
  // Keep default TypeScript checks; enable ignoreBuildErrors only if you want to skip type errors too.
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
