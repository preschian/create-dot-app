---
"create-dot-app": minor
---

feat(next-dedot): connect through an in-browser smoldot light client by default (SmoldotProvider + @dedot/chain-specs in a Web Worker) instead of a remote RPC node, matching the next-papi stack. This also fixes Paseo Asset Hub resolving to the wrong chain: the previous `wss://pas-rpc.stakeworld.io/assethub` endpoint actually served Polkadot Asset Hub, so the app showed DOT and an incorrect balance; the light client now syncs the correct chain from its chain spec (PAS).
