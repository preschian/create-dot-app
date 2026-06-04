---
"create-dot-app": patch
---

fix(templates): load the smoldot Web Worker from a local file so it works under Next.js Turbopack. next-dedot and next-papi created the worker from a bare package specifier (`new Worker(new URL('dedot/smoldot/worker', ...))`), which Turbopack cannot resolve at runtime ("request.indexOf is not a function"), so the light client never connected. The worker now loads from a local `app/utils/smoldot-worker.ts` that dynamically imports the SDK worker (dynamic so it survives the production build's tree-shaking, since both SDKs ship `sideEffects: false`).
