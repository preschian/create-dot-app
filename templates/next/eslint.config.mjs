import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** Override "detect" — eslint-plugin-react auto-detection breaks on ESLint 10. */
function withEslint10ReactSettings(configs) {
  return configs.map((config) => ({
    ...config,
    settings: {
      ...config.settings,
      react: {
        ...config.settings?.react,
        version: "19",
      },
    },
  }));
}

const config = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
  },
  ...withEslint10ReactSettings(nextCoreWebVitals),
  ...withEslint10ReactSettings(nextTypescript),
];

export default config;
