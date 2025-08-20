import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  reactStrictMode: false,
  webpack: (config, { dev, isServer }) => {
    // Tối ưu cho development
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };

      // Tăng tốc compile
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
        minimize: false,
        concatenateModules: false,
      };

      // Disable source maps trong development
      config.devtool = "eval";
    }

    return config;
  },

  // Tối ưu TypeScript - bỏ qua lỗi trong development
  typescript: {
    ignoreBuildErrors: true,
  },

  // Tối ưu ESLint - bỏ qua trong development
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
