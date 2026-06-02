/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  turbopack: {
    resolveAlias: {
      "pino-pretty": "./lib/empty-module.js",
      "@react-native-async-storage/async-storage": "./lib/empty-module.js",
      "@metamask/sdk-analytics": "./lib/metamask-analytics-stub.js",
    },
  },
};
module.exports = nextConfig
