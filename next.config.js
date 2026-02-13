/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Dynamic deployment for SSR/ISR
  images: {
    domains: ['classionextgen.in-maa-1.linodeobjects.com', 'https://pankajaswani.netlify.app'],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'classionextgen.in-maa-1.linodeobjects.com',
      },
      {
        protocol: 'https',
        hostname: 'https://pankajaswani.netlify.app',
      },
    ],
  },
  trailingSlash: false,
  // Enable SWC minification for better performance
  swcMinify: true,
  // Compression
  compress: true,
  // Enable standalone output for Docker/Nginx deployment
  output: 'standalone',
  // Optimize production builds
  poweredByHeader: false,
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

