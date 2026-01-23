/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export enabled for drag-and-drop deployment
  output: 'export',
  images: {
    domains: ['classiocafinal.in-maa-1.linodeobjects.com'],
    unoptimized: true,
  },
  trailingSlash: false,
};

module.exports = nextConfig;

