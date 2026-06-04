---
"create-dot-app": patch
---

fix(next-dedot): wait for the dedot client to be ready before issuing reads/extrinsics, so a mid-reconnect `system.remark` no longer throws "call `.connect()` first"
