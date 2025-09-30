# Pera Wallet Integration Guide

## Overview
TranXact integrates with Pera Wallet to enable secure Algorand blockchain transactions for donations.

## Issues Fixed

### ✅ Critical Issues Resolved
1. **Added Algorand SDK** - Now using `algosdk` for real blockchain interactions
2. **Removed Conflicting Libraries** - Removed `@txnlab/use-wallet` to avoid conflicts
3. **Fixed Invalid Addresses** - Using proper TestNet addresses for development
4. **Added Network Configuration** - Proper TestNet/MainNet configuration

### ✅ High Priority Issues Resolved
1. **Real Transaction Implementation** - Actual blockchain transactions instead of mocks
2. **Network Configuration** - Proper Algorand node endpoints
3. **Error Handling** - Comprehensive error scenarios covered
4. **State Management** - Proper wallet state synchronization

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @perawallet/connect algosdk
```

### 2. Environment Configuration
Create `.env.local` file:
```env
VITE_APP_NAME=TranXact
VITE_ALGORAND_NETWORK=testnet
VITE_ENABLE_REAL_TRANSACTIONS=true
```

### 3. Wallet Connection Flow
1. User clicks "Connect Wallet" button
2. Pera Wallet opens (mobile app or web extension)
3. User approves connection
4. Wallet address is stored and displayed
5. User can now make donations

### 4. Transaction Flow
1. User selects NGO and enters donation amount
2. Transaction is created using Algorand SDK
3. Pera Wallet signs the transaction
4. Transaction is submitted to Algorand network
5. Confirmation is awaited and displayed

## Key Components

### WalletProvider (`src/contexts/WalletProvider.tsx`)
- Manages wallet connection state
- Handles connect/disconnect operations
- Persists connection across page refreshes
- Provides wallet context to all components

### AlgorandService (`src/lib/algorand.ts`)
- Handles all Algorand blockchain operations
- Creates and signs transactions
- Fetches account balances
- Manages network configuration

### WalletConnect (`src/components/WalletConnect.tsx`)
- UI component for wallet connection
- Shows connection status and account info
- Handles loading states

## Network Configuration

### TestNet (Development)
- Chain ID: 416002
- API: https://testnet-api.algonode.cloud
- Indexer: https://testnet-idx.algonode.cloud

### MainNet (Production)
- Chain ID: 416001
- API: https://mainnet-api.algonode.cloud
- Indexer: https://mainnet-idx.algonode.cloud

## Testing

### Prerequisites
1. Install Pera Wallet mobile app or browser extension
2. Create TestNet account
3. Fund account with TestNet ALGOs from faucet

### Test Scenarios
1. **Wallet Connection**
   - Connect wallet successfully
   - Disconnect wallet
   - Reconnect on page refresh

2. **Balance Checking**
   - View account balance
   - Refresh balance
   - Handle network errors

3. **Donations**
   - Select NGO and amount
   - Sign transaction with wallet
   - Confirm transaction on blockchain
   - View transaction success

## Error Handling

### Common Errors
- **User Rejection**: Transaction cancelled by user
- **Insufficient Balance**: Not enough ALGOs for transaction
- **Network Error**: Connection issues with Algorand network
- **Invalid Address**: Malformed wallet addresses

### Error Messages
All errors are displayed with user-friendly messages and appropriate actions.

## Security Considerations

1. **Private Keys**: Never stored in application
2. **Transaction Signing**: Always done in Pera Wallet
3. **Network Validation**: All transactions validated on-chain
4. **Address Validation**: Proper Algorand address format checking

## Production Deployment

### Before Going Live
1. Switch to MainNet configuration
2. Update NGO wallet addresses to real addresses
3. Test with small amounts first
4. Enable production monitoring

### Environment Variables
```env
VITE_ALGORAND_NETWORK=mainnet
VITE_ENABLE_REAL_TRANSACTIONS=true
```

## Troubleshooting

### Common Issues
1. **Wallet Not Connecting**: Check Pera Wallet is installed and updated
2. **Transaction Failing**: Verify sufficient balance and network connectivity
3. **Balance Not Loading**: Check network configuration and account existence

### Debug Mode
Enable console logging by setting:
```javascript
localStorage.setItem('debug', 'true');
```

## Next Steps

1. **Smart Contracts**: Implement milestone-based donations
2. **Multi-Signature**: Add governance for large donations
3. **Asset Support**: Enable ASA (Algorand Standard Asset) donations
4. **Analytics**: Track donation metrics and impact

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Pera Wallet connection
3. Test on TestNet first
4. Review transaction logs