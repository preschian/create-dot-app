# Smart contracts (Hardhat)

Solidity workspace for [Polkadot Hub](https://docs.polkadot.com/smart-contracts/), configured per the [Hardhat dev environment guide](https://docs.polkadot.com/smart-contracts/dev-environments/hardhat/).

The default network (`polkadotTestnet`) matches **Polkadot Hub TestNet** used by the Next.js app (`chainId` `420420417` / `0x190f1b41`).

## Prerequisites

- Node.js 20+ (LTS)
- npm

## Setup

From the **project root** (monorepo — `npm install` installs this workspace too):

```bash
npm install
```

Store your deployer private key with Hardhat vars (recommended). Run from the project root or from `contracts/`:

```bash
npm exec -w hardhat hardhat vars set PRIVATE_KEY
```

## Scripts

From the project root:

```bash
npm run compile:contracts
npm run test:contracts
npm run deploy:contracts
```

Or from this directory (`contracts/`):

```bash
npm run compile   # compile Solidity and export ABIs to ../lib/contracts/
npm test          # run tests on the built-in Hardhat network
npm run deploy    # deploy Flipper + Remark via Ignition to Polkadot Hub TestNet
```

Deploy requires `PRIVATE_KEY` to be set and the account funded with test PAS.

## Verify on Blockscout

After deployment:

```bash
npm exec -w hardhat hardhat verify --network polkadotTestnet <FLIPPER_ADDRESS> false
npm exec -w hardhat hardhat verify --network polkadotTestnet <REMARK_ADDRESS>
```

Copy the deployed testnet addresses into [`../lib/contracts/addresses.ts`](../lib/contracts/addresses.ts) (mainnet and Kusama Hub can stay unset).

## Layout

| Path | Purpose |
| --- | --- |
| `contracts/Flipper.sol` | Boolean flipper — `flipper.flip()` in the welcome demo |
| `contracts/Remark.sol` | On-chain remark — `system.remark()` in the welcome demo |
| `ignition/modules/DemoModule.ts` | Deploys both contracts |
| `test/` | Contract tests |
| `hardhat.config.ts` | Networks, compiler, Blockscout verification |
