// Worker entry for the smoldot light client. dedot ships the worker as
// 'dedot/smoldot/worker', but Next.js/Turbopack only resolves a *relative* URL
// literal in `new Worker(new URL('./…', import.meta.url))`; handing it a bare
// package specifier makes Turbopack's worker loader throw "request.indexOf is
// not a function" at runtime. So the Worker points at this local file and we
// pull dedot's worker in here instead. The import is dynamic because dedot is
// published with `sideEffects: false`, which lets the production build
// tree-shake a plain `import 'dedot/smoldot/worker'` away (leaving an empty,
// silent worker); a dynamic import is always retained.
import('dedot/smoldot/worker')
