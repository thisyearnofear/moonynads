# ⛓️ Moonynads Blockchain Integration

## 🌐 Monad Network Integration

### Network Configuration
- **Chain ID**: 143
- **Currency**: MON
- **RPC Endpoint**: https://rpc.monad.xyz
- **Block Explorer**: https://monadvision.com
- **Block Time**: ~1 second
- **Gas Price**: ~1 gwei

### Frontend Web3 Stack
```typescript
// Wagmi v2 configuration
import { createConfig, http } from 'wagmi'
import { monad } from 'wagmi/chains'

export const config = createConfig({
  chains: [monad],
  transports: {
    [monad.id]: http('https://rpc.monad.xyz'),
  },
})

// Automatic network switching
import { useChainId, useSwitchChain } from 'wagmi'
```

## 📜 Smart Contract Architecture

### Moonynads.sol (Enhanced)
**Standard**: ERC721 with Enumerable, URIStorage, Pausable extensions

### Key Features
```solidity
// Token payment system
IERC20 public m00nadToken;
uint256 public constant MINT_PRICE_M00NAD = 100_000_000;      // 100M
uint256 public constant DISCOUNT_PRICE_M00NAD = 50_000_000; // 50M

// Three-tier allowlist system
mapping(address => uint256) public allowlistTier; // 0=none, 1=discount, 2=free
mapping(uint256 => mapping(address => bool)) public allowlistMinted;

// Advent calendar mechanics
function mintAdventToken(uint256 day) external nonReentrant whenNotPaused
function mintAdventTokenAllowlist(uint256 day) external nonReentrant whenNotPaused
function setAllowlist(address[] calldata addresses, uint256[] calldata tiers) external onlyOwner
```

## 💰 Token Payment System

### Implementation
- **$m00nad token** replaces native MON payments
- **Automatic tier detection** during mint process
- **Treasury management** via on-chain token transfers
- **Batch allowlist management** for efficiency

### Pricing Tiers
| Tier | Price | Requirement |
|------|--------|-------------|
| **None** | 100M m00nad | General public |
| **Discount** | 50M m00nad | Tier 1 allowlist |
| **Free** | 0M m00nad | Tier 2 allowlist |

### Frontend Integration
```typescript
// Frontend integration
import { MINT_PRICE_M00NAD, DISCOUNT_PRICE_M00NAD } from '@/lib/contracts'
import { useAllowlist } from '@/hooks/blockchain/use-allowlist'

// Automatic price calculation
const tier = useAllowlist(address)
const price = tier === 2 ? 0 : tier === 1 ? DISCOUNT_PRICE_M00NAD : MINT_PRICE_M00NAD
```

## 🔐 Allowlist Management System

### Admin Interface
- **CSV import** for batch address management
- **Visual preview** before submission
- **Tier assignment** (0/1/2) with validation
- **Transaction tracking** with error handling

### Smart Contract Functions
```solidity
// Batch allowlist updates
function setAllowlist(address[] calldata addresses, uint256[] calldata tiers) 
    external onlyOwner 
{
    require(addresses.length == tiers.length, "Array length mismatch");
    for (uint256 i = 0; i < addresses.length; i++) {
        require(tiers[i] <= 2, "Invalid tier");
        allowlistTier[addresses[i]] = tiers[i];
    }
    emit AllowlistUpdated(addresses, tiers);
}

// Allowlist mint with tier validation
function mintAdventTokenAllowlist(uint256 day) external nonReentrant whenNotPaused {
    uint256 tier = allowlistTier[msg.sender];
    require(tier > 0, "Not on allowlist");
    require(!allowlistMinted[day][msg.sender], "Already minted for this day");
    
    // Tier 1: Pay discount (50M m00nad)
    if (tier == 1) {
        require(m00nadToken.transferFrom(msg.sender, address(this), DISCOUNT_PRICE_M00NAD));
    }
    // Tier 2: Free (no payment)
    
    allowlistMinted[day][msg.sender] = true;
    _executeMint(day);
}
```

## 📡 API Architecture

### Metadata Service
```typescript
// Dynamic metadata generation
/api/metadata/[tokenId] -> {
  "name": "Moonynad #1001",
  "description": "Lunar ASCII art collectible",
  "image": "https://moonynads.xyz/api/image/1001",
  "animation_url": "ipfs://...", // For animated NFTs
  "attributes": [
    {"trait_type": "Rarity", "value": "Epic"},
    {"trait_type": "Day", "value": "13"},
    {"trait_type": "Animation", "value": "lineWave"}
  ]
}
```

### Image Generation
```typescript
// SVG creation from ASCII art
/api/image/[tokenId] -> SVG with:
- ASCII art rendering
- Token ID embedding
- Lunar-themed styling
- Dynamic rarity indicators
```

## 🏗️ Contract Deployment Process

### Prerequisites
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Environment setup
cd blockchain
cp .env.example .env
# Add private key and RPC URL
```

### Deployment Commands
```bash
# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts

# Compile contracts
forge build

# Deploy to Monad mainnet
forge script script/Deploy.s.sol \
  --rpc-url https://rpc.monad.xyz \
  --broadcast \
  --verify

# Verify on block explorer
forge verify-contract <CONTRACT_ADDRESS> src/Moonynads.sol:Moonynads \
  --rpc-url https://rpc.monad.xyz \
  --constructor-args $(cast abi-encode "constructor(string,string,string)" "Moonynads" "MOONY" "https://moonynads.xyz/api/metadata")
```

## 🔍 Security Features

### Smart Contract Security
- **OpenZeppelin battle-tested** contracts
- **Reentrancy protection** on all external functions
- **Pausable functionality** for emergency stops
- **Owner-only admin functions** with proper access control
- **Daily mint limits** prevent oversupply

### Frontend Security
- **Input validation** on all user inputs
- **Transaction state management** with proper error handling
- **Wallet connection security** with verified providers
- **Network validation** prevents wrong chain interactions