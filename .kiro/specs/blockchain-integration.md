# Blockchain Integration Specification

## Overview
Integrate Monad L2 blockchain with custom ERC20 token payments, three-tier allowlist system, and Farcaster wallet connector.

## Requirements

### Network Configuration
- **Chain**: Monad L2 (Chain ID: 143)
- **RPC**: https://rpc.monad.xyz
- **Explorer**: https://explorer.monad.xyz
- **Native Token**: MON

### Smart Contract Features
1. **ERC721 NFT** (Moonynads.sol)
   - Enumerable extension
   - URI Storage for metadata
   - Pausable for emergency stops
   - Ownable for admin functions

2. **Payment System**
   - Accept $m00nad ERC20 tokens
   - Variable pricing per tier
   - Automatic token transfer on mint

3. **Allowlist System** (3 tiers)
   - Tier 1: Free mint (0 tokens)
   - Tier 2: Discounted (50% off)
   - Tier 3: Standard pricing
   - Batch management functions

4. **Advent Calendar Mechanics**
   - Time-locked minting per day
   - Daily unlock schedule
   - Rarity calculation based on mint time

### Web3 Integration

#### Wallet Connection
```typescript
// wagmi v2 configuration
- MetaMask connector
- Farcaster Mini App connector
- WalletConnect v2
- Coinbase Wallet
```

#### Contract Interactions
```typescript
// Read operations
- balanceOf(address): Get NFT count
- tokenOfOwnerByIndex(address, index): Get token IDs
- getAllowlistTier(address): Check tier status
- getCurrentPrice(): Get current mint price

// Write operations
- mint(uint256 amount): Mint NFTs
- setAllowlistTier(address, tier): Admin function
- batchSetAllowlist(addresses[], tiers[]): Batch admin
```

#### Token Gating
```typescript
interface TierAccess {
  minBalance: number
  features: string[]
  discount: number
}

// Tiers
- Moonlet: 0-999 tokens (basic access)
- Lunar: 1000-9999 tokens (early access)
- Eclipse: 10000+ tokens (VIP access)
```

## Technical Architecture

### Hook Structure
```typescript
// Token balance
useTokenBalance(address?: Address)
  - Real-time balance updates
  - Automatic refresh on block
  - Returns: { balance, isLoading, error }

// NFT ownership
useMoonynads(address?: Address)
  - Fetch owned token IDs
  - Metadata loading
  - Returns: { tokens, isLoading, error }

// Allowlist status
useAllowlist(address?: Address)
  - Check tier status
  - Calculate discount
  - Returns: { tier, discount, isLoading }
```

### Component Structure
```typescript
<WalletConnect />
  - Multi-connector support
  - Network switching
  - Connection state

<TokenGate minBalance={number}>
  - Conditional rendering
  - Balance verification
  - Upgrade prompts

<AllowlistManager />
  - CSV import
  - Batch processing
  - Transaction tracking
```

## Implementation Details

### Monad Network Config
```typescript
export const monad = {
  id: 143,
  name: 'Monad',
  network: 'monad',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: ['https://rpc.monad.xyz'] },
    public: { http: ['https://rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://explorer.monad.xyz' },
  },
}
```

### Contract ABIs
- Stored in `lib/contracts.ts`
- Includes ERC721 + custom functions
- Type-safe with wagmi codegen

### Allowlist CSV Format
```csv
address,tier
0x1234...,1
0x5678...,2
0x9abc...,3
```

## Success Criteria
- [ ] Wallet connects on all supported connectors
- [ ] Network auto-switches to Monad
- [ ] Token balance displays correctly
- [ ] Allowlist tiers verified on-chain
- [ ] CSV import processes 1000+ addresses
- [ ] Token-gated features work correctly
- [ ] Transactions succeed with proper gas estimation

## Kiro Implementation Notes
- Configured wagmi v2 with Monad chain definitions
- Implemented custom hooks for contract interactions
- Built CSV parser with validation
- Created batch transaction system for allowlist
- Integrated Farcaster connector for mini app
