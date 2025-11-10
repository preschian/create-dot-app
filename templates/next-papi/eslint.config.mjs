import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [{
  ignores: ['app/descriptors/**'],
}, ...nextCoreWebVitals, ...nextTypescript]

export default config
