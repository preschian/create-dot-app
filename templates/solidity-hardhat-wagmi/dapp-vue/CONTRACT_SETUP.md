# MessageBoard Contract Integration Setup

## Overview
This dApp has been integrated with the MessageBoard smart contract. The UI now connects to the actual contract instead of using dummy data.

## Setup Instructions

### 1. Deploy Your Contract
First, deploy the MessageBoard contract to Passet Hub Testnet:

```bash
# In your hardhat project directory
npx hardhat run scripts/deploy.js --network passet-hub-testnet
```

### 2. Update Contract Address
After deployment, update the contract address in `src/config/contracts.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  // Passet Hub Testnet
  420420422: {
    MessageBoard: '0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE', // Replace with actual address
  },
} as const
```

### 3. Network Configuration
The dApp is configured for Passet Hub Testnet:
- **Chain ID:** 420420422
- **RPC URL:** https://testnet-passet-hub-eth-rpc.polkadot.io
- **Currency:** PAS (12 decimals)

## Features Implemented

### ✅ Contract Integration
- **Read Operations:**
  - `getAllMessages()` - Fetches all messages from contract
  - `getTotalMessages()` - Gets total message count
  - `getMessagesBySender()` - Gets user's message count

- **Write Operations:**
  - `postMessage()` - Posts new message to contract

### ✅ Real-time Updates
- Automatically refreshes data after successful transactions
- Shows loading states during contract calls
- Displays transaction confirmation status

### ✅ Error Handling
- Connection warnings for disconnected wallets
- Contract error display
- Fallback states for missing contract addresses

### ✅ User Experience
- Loading indicators during contract operations
- Transaction status feedback (Posting... → Confirming...)
- Disabled states when wallet not connected
- Real user statistics from contract

## Contract Functions Used

Based on the MessageBoard ABI:

1. **getAllMessages()** → Returns array of Message structs
2. **getTotalMessages()** → Returns uint256 total count
3. **getMessagesBySender(address)** → Returns user's messages
4. **postMessage(string)** → Creates new message
5. **MessagePosted Event** → Emitted when message is posted

## Development Notes

- Contract address validation prevents calls to undeployed contracts
- TypeScript types ensure type safety with contract interactions
- Wagmi hooks handle caching and automatic refetching
- All contract calls are properly typed using the ABI

## Testing

1. **Connect Wallet:** Use MetaMask or Talisman
2. **Get Test Tokens:** Use the faucet link in the UI
3. **Post Messages:** Create new messages and see them appear
4. **View Statistics:** Check your message count updates
5. **Transaction History:** Monitor transaction status

## Troubleshooting

### Common Issues:
1. **"Contract address not configured"** → Update `src/config/contracts.ts`
2. **"No messages loading"** → Check contract deployment
3. **"Transaction failing"** → Ensure sufficient PAS balance
4. **"Wallet not connecting"** → Check network configuration

### Debug Steps:
1. Check browser console for errors
2. Verify contract address is correct
3. Confirm wallet is on Passet Hub Testnet
4. Check transaction status on block explorer
