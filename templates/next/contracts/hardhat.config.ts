import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-verify'
import { vars } from 'hardhat/config'

// https://docs.polkadot.com/smart-contracts/dev-environments/hardhat/
const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    polkadotTestnet: {
      url: 'https://services.polkadothub-rpc.com/testnet',
      chainId: 420420417,
      accounts: vars.has('PRIVATE_KEY') ? [vars.get('PRIVATE_KEY')] : [],
    },
  },
  etherscan: {
    apiKey: {
      polkadotTestnet: 'no-api-key-needed',
    },
    customChains: [
      {
        network: 'polkadotTestnet',
        chainId: 420420417,
        urls: {
          apiURL: 'https://blockscout-testnet.polkadot.io/api',
          browserURL: 'https://blockscout-testnet.polkadot.io/',
        },
      },
    ],
  },
}

export default config
