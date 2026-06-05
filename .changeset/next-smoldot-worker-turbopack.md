---
"create-dot-app": patch
---

fix(next-papi): load the smoldot Web Worker from a local file so it works under Next.js Turbopack. The worker was created from a bare package specifier, which Turbopack cannot resolve at runtime ("request.indexOf is not a function"), so the light client never connected. The worker now loads from a local `app/utils/smoldot-worker.ts` that dynamically imports the SDK worker (dynamic so it survives the production build's tree-shaking, since the SDK ships `sideEffects: false`).
