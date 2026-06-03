// Side-effect imports so static analysis sees Turbopack alias targets as reachable.
import "./config/empty-module.js";
import "./config/metamask-analytics-stub.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    resolveAlias: {
      "pino-pretty": "./config/empty-module.js",
      "@react-native-async-storage/async-storage": "./config/empty-module.js",
      "@metamask/sdk-analytics": "./config/metamask-analytics-stub.js",
    },
  },
};

export default nextConfig;
