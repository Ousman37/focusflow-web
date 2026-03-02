// next.config.ts  (recommended to use .ts for better type safety)
// or next.config.mjs if you prefer ESM-only

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // === Core & Performance Settings ===
  reactStrictMode: true, // Helps catch bugs in development
  poweredByHeader: false, // Remove "X-Powered-By: Next.js" header (security/privacy)
  compress: true, // Enable gzip/brotli compression

  // === Image Optimization ===
  images: {
    // Allow remote images if needed later (e.g. user avatars from Firebase Storage)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // or be specific: 'firebasestorage.googleapis.com', 'images.unsplash.com'
      },
    ],
    // Increase cache duration for production
    minimumCacheTTL: 60,
    formats: ["image/avif", "image/webp"], // modern formats
  },

  // === Experimental / Future-Proof Features ===
  experimental: {
    // Enable Turbopack in dev (faster than Webpack in Next.js 15+)
    // Comment out if you have issues with it
    // turbo: true,

    // Better server actions / partial prerendering support
    serverActions: {
      bodySizeLimit: "2mb",
    },

    // Helps with metadata image loading timeouts in some cases
    optimizePackageImports: ["framer-motion", "lucide-react"], // add libs you use
  },

  // === Webpack tweaks (if you still see cache rename errors) ===
  webpack: (config, { dev, isServer }) => {
    // Disable persistent cache in dev if rename errors persist
    if (dev && !isServer) {
      config.cache = false;
    }

    // Optional: optimize for smaller bundles
    config.optimization = {
      ...config.optimization,
      minimize: !dev,
    };

    return config;
  },

  // === Headers / Security (good defaults for SaaS) ===
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
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
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // === Redirects (optional – add later if needed) ===
  // async redirects() {
  //   return [
  //     {
  //       source: '/old-path',
  //       destination: '/new-path',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
