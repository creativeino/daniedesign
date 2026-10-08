/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    // Host ka glibc purana hai (GLIBC_2.29 missing), sharp/SWC native
    // binaries fail hote hain, isliye optimization band rakhi hai.
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
