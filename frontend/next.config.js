/** @type {import('next').NextConfig} */
const nextConfig = {
  // "export" = generates static HTML/CSS/JS — required for Namecheap shared hosting
  output: "export",
  trailingSlash: true, // ensures links work correctly on shared hosting
  images: {
    // Image optimization disabled — shared hosting has outdated glibc
    // (GLIBC_2.29 missing), so sharp/SWC native binaries fail.
    unoptimized: true,
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
    ],
  },
  async redirects() {
    return [
      { source: "/solutions", destination: "/services", permanent: true },
      { source: "/solutions/:slug", destination: "/services/:slug", permanent: true },
    ];
  },
};

module.exports = nextConfig;
