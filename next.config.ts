import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/milkready",
        destination: "https://milkready.milkimom.com",
        permanent: false,
      },
      {
        source: "/smoothflow",
        destination: "https://smoothflow.milkimom.com",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
