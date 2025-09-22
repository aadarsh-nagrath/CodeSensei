/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC for ARM64 compatibility
  swcMinify: false,
  experimental: {
    // Use Babel instead of SWC for better ARM64 compatibility
    forceSwcTransforms: false,
  },
};

export default nextConfig;
