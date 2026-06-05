---
"create-dot-app": patch
---

fix(next-papi): add `esbuild` as an explicit devDependency so the `papi` postinstall works under Yarn Classic v1. Yarn v1 does not auto-install peer dependencies (npm/pnpm/bun do), so `rollup-plugin-esbuild` — pulled in by the polkadot-api CLI — could not resolve its `esbuild` peer, failing the package-managers CI with `ERR_MODULE_NOT_FOUND: Cannot find package 'esbuild'` before lint/build even ran.
