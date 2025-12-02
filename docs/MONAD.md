# Moonynads Blockchain Infrastructure

## Overview
Moonynads is an onchain NFT gallery featuring ASCII art collectibles on Monad blockchain. Users can mint unique lunar-themed NFTs through a seasonal advent calendar and collect rare digital art pieces.

## Smart Contract Architecture

### Core Contract: `Moonynads.sol`
- **Standard**: ERC721 with extensions (Enumerable, URIStorage, Pausable)
- **Features**:
  - Advent calendar minting (Dec 13-24)
  - Dynamic rarity based on mint order
  - Daily mint limits (100 per day)
  - Affordable minting (0.001 MON ~$0.01)
  - Metadata and image generation

### Key Functions
```solidity
function mintAdventToken(uint256 day) external payable
function getTokenRarity(uint256 tokenId) external view returns (string)
function isAdventTokenMinted(uint256 day, address user) external view returns (bool)
```

## Deployment on Monad

### Prerequisites
1. **Foundry Framework**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Environment Setup**
   ```bash
   cd contracts
   cp .env.example .env
   # Edit .env with your private key and RPC URL
   ```

### Deploy Contract
```bash
cd contracts

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts

# Compile contracts
forge build

# Deploy to Monad mainnet
forge script script/Deploy.s.sol --rpc-url https://rpc.monad.xyz --broadcast --verify
```

### Verify on Block Explorer
After deployment, verify the contract on MonadScan:
```bash
forge verify-contract <CONTRACT_ADDRESS> src/Moonynads.sol:Moonynads \
  --rpc-url https://rpc.monad.xyz \
  --constructor-args $(cast abi-encode "constructor(string,string,string)" "Moonynads" "MOONY" "https://moonynads.xyz/api/metadata")
```

## Frontend Integration

### Web3 Setup
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript Ethereum library
- **Chain**: Monad mainnet (Chain ID: 143)

### Key Components
1. **ConnectWallet**: Wallet connection UI
2. **AdventMint**: Minting interface for advent calendar
3. **NFTGallery**: Display owned NFTs and collection
4. **Web3Provider**: Wagmi configuration wrapper

### Environment Variables
Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
```

## API Endpoints

### Metadata API
- **URL**: `/api/metadata/[tokenId]`
- **Returns**: Standard NFT metadata (name, description, image, attributes)
- **Features**: Dynamic rarity calculation, ASCII content inclusion

### Image API
- **URL**: `/api/image/[tokenId]` 
- **Returns**: SVG image generated from ASCII art
- **Features**: Styled SVG with proper dimensions and branding

## Rarity System

### Mint Order Based Rarity
- **Legendary**: First 5 mints (positions 1-5)
- **Epic**: Next 10 mints (positions 6-15) 
- **Rare**: Next 20 mints (positions 16-35)
- **Uncommon**: Next 35 mints (positions 36-70)
- **Common**: Remaining mints (positions 71-100)

### Token ID Structure
- Base tokens: 1-13 (original collection)
- Advent variants: `baseId * 1000 + mintOrder`
- Example: Token 1001 = Moon #1, 1st advent mint

## Monad Network Details

### Network Configuration
- **Chain ID**: 143
- **Currency**: MON
- **RPC**: https://rpc.monad.xyz
- **Explorer**: https://monadvision.com

### Gas & Fees
- **Mint Cost**: 0.001 MON (~$0.01)
- **Gas Price**: ~1 gwei (very low fees)
- **Block Time**: ~1 second (fast confirmations)

## Security Features

### Smart Contract
- OpenZeppelin battle-tested contracts
- Reentrancy protection
- Pausable functionality
- Owner-only admin functions
- Daily mint limits

### Frontend
- Input validation
- Transaction state management
- Error handling
- Wallet connection security

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Deploy contracts locally (optional)
cd contracts
anvil # Start local node
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

### Testing
```bash
# Test contracts
cd contracts
forge test

# Test frontend
npm run test
```

## Deployment Checklist

### Pre-deployment
- [ ] Test contracts thoroughly
- [ ] Set correct base URI for metadata
- [ ] Configure network settings
- [ ] Fund deployer wallet with MON

### Post-deployment
- [ ] Update contract address in frontend
- [ ] Test minting functionality
- [ ] Verify contract on block explorer
- [ ] Deploy metadata/image APIs
- [ ] Test end-to-end flow

### Mainnet Launch
- [ ] Deploy to production environment
- [ ] Monitor contract interactions
- [ ] Set up analytics tracking
- [ ] Prepare marketing materials
- [ ] Community announcement

## Support & Resources

### Monad Documentation
- [Official Docs](https://docs.monad.xyz)
- [Network Details](https://docs.monad.xyz/technical-discussion/networking)
- [Developer Tools](https://docs.monad.xyz/tooling-and-infrastructure)

### Block Explorers
- [MonadVision](https://monadvision.com)
- [MonadScan](https://monadscan.com)
- [SocialScan](https://monad.socialscan.io)

### Community
- [Discord](https://discord.gg/monad)
- [Twitter](https://twitter.com/monad_xyz)
- [GitHub](https://github.com/monadxyz)

## License
MIT License - see LICENSE file for details.