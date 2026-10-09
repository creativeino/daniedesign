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
  // NOTE: redirects() is NOT supported with output: "export".
  // To redirect /solutions → /services on Namecheap, add these lines to .htaccess:
  //   Redirect 301 /solutions  /services
  //   Redirect 301 /solutions/ /services/
};

module.exports = nextConfig;
