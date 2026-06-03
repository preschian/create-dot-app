/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  turbopack: {
    resolveAlias: {
      "pino-pretty": "./config/empty-module.js",
      "@react-native-async-storage/async-storage": "./config/empty-module.js",
      "@metamask/sdk-analytics": "./config/metamask-analytics-stub.js",
    },
  },
};
module.exports = nextConfig
