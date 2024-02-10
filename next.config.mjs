/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "5b9iwcfsiut8ybgm.public.blob.vercel-storage.com",
        port: "",
        pathname: "/country-icons/**",
      },
      {
        protocol: "https",
        hostname: "8bizuacxodgnvxgb.public.blob.vercel-storage.com",
        port: "",
        pathname: "/country-compare-images-compressed/**",
      },
    ],
  },
};

export default nextConfig;
