import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Dev-only: the FastAPI backend serves /uploads from localhost, which
    // Next 16's image optimizer blocks by default (private-IP SSRF guard).
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "daniedesign.com",
      },
      // Cloudinary — where all admin uploads (images + videos) are stored.
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // Deployed FastAPI backend — serves legacy DB-stored /uploads files.
      {
        protocol: "https",
        hostname: "*.vercel.app",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/solutions", destination: "/services", permanent: true },
      { source: "/solutions/:slug", destination: "/services/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
