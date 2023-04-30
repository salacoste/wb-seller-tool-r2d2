/** @type {import('next').NextConfig} */
const nextConfig = {
  // distDir: 'build',
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, dns: false, tls: false };

    return config;
  },

  // experimental: {
  //   appDir: true,
  // },
}

module.exports = nextConfig
