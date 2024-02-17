/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nomadstats.s3.amazonaws.com",
        port: "",
        pathname: "/CompressedImages/**",
      },
    ],
  },
};

export default nextConfig;
