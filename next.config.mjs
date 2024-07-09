/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ['child_process'],
    },
  };
  
  export default nextConfig;