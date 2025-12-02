import type { HardhatUserConfig } from 'hardhat/config'
import process from 'node:process'
import * as dotenv from 'dotenv'
import '@nomicfoundation/hardhat-toolbox'
import '@parity/hardhat-polkadot'

// Load environment variables from .env.development file
// Override with .env file if it exists
dotenv.config({ path: ['.env.development', '.env'], override: true })

// https://docs.polkadot.com/develop/smart-contracts/dev-environments/hardhat/
const config: HardhatUserConfig = {
  solidity: '0.8.28',
  resolc: {
    compilerSource: 'npm',
    settings: {
      optimizer: {
        enabled: true,
        parameters: 'z',
        fallbackOz: true,
        runs: 200,
      },
      // standardJson: true,
    },
  },
  networks: {
    hardhat: {
      polkadot: {
        target: 'evm',
      },
    },
    passetHub: {
      polkadot: {
        target: 'evm',
      },
      url: 'https://testnet-passet-hub-eth-rpc.polkadot.io',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
}

export default config
