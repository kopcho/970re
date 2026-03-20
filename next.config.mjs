/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media-demo.mlsgrid.com",
      },
      {
        protocol: "https",
        hostname: "media.mlsgrid.com",
      },
    ],
  },
};

export default nextConfig;
