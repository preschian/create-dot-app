import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig(
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**", "contracts/**"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Fail on symbols marked @deprecated in library types (wagmi: useAccount, switchChain, writeContract, …).
      "@typescript-eslint/no-deprecated": "error",
    },
  },
);
