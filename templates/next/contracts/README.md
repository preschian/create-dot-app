# Smart contracts (Hardhat)

Solidity workspace for [Polkadot Hub](https://docs.polkadot.com/smart-contracts/), configured per the [Hardhat dev environment guide](https://docs.polkadot.com/smart-contracts/dev-environments/hardhat/).

The default network (`polkadotTestnet`) matches **Polkadot Hub TestNet** used by the Next.js app (`chainId` `420420417` / `0x190f1b41`).

## Prerequisites

- Node.js 20+ (LTS)
- npm

## Setup

```bash
cd contracts
npm install
```

Store your deployer private key with Hardhat vars (recommended):

```bash
npx hardhat vars set PRIVATE_KEY
```

## Scripts

```bash
npm run compile   # compile Solidity and export ABI to ../lib/contracts/
npm test          # run tests on the built-in Hardhat network
npm run deploy    # deploy Flipper via Ignition to Polkadot Hub TestNet
```

Deploy requires `PRIVATE_KEY` to be set and the account funded with test PAS.

## Verify on Blockscout

After deployment:

```bash
npx hardhat verify --network polkadotTestnet <FLIPPER_ADDRESS> false
```

Copy the deployed testnet address into [`../lib/contracts/addresses.ts`](../lib/contracts/addresses.ts) (mainnet and Kusama Hub can stay unset).

## Layout

| Path | Purpose |
| --- | --- |
| `contracts/Flipper.sol` | Boolean flipper — powers `flipper.flip()` in the welcome demo |
| `ignition/modules/` | Ignition deployment modules |
| `test/` | Contract tests |
| `hardhat.config.ts` | Networks, compiler, Blockscout verification |
