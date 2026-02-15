import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "picsum.photos",
      "cdn.jsdelivr.net",
      "avatars.githubusercontent.com",
      "placeimg.com"
    ],
  },
};

export default nextConfig;
