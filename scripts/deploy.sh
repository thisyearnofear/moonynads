#!/bin/bash

# Moonynads Deployment Script for Monad Blockchain
set -e

echo "🌙 Moonynads Deployment to Monad Mainnet"
echo "========================================="

# Check prerequisites
command -v forge >/dev/null 2>&1 || { echo "❌ Foundry not installed. Install with: curl -L https://foundry.paradigm.xyz | bash"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js not installed"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm not installed"; exit 1; }

# Environment check
if [ ! -f "contracts/.env" ]; then
    echo "❌ contracts/.env file not found. Copy from .env.example and configure."
    exit 1
fi

echo "✅ Prerequisites verified"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd blockchain
forge install --no-commit OpenZeppelin/openzeppelin-contracts
cd ..

# Compile contracts
echo "🔨 Compiling smart contracts..."
cd blockchain
forge build
if [ $? -ne 0 ]; then
    echo "❌ Contract compilation failed"
    exit 1
fi
echo "✅ Contracts compiled successfully"

# Deploy contracts
echo "🚀 Deploying to Monad mainnet..."
source .env
forge script script/Deploy.s.sol \
    --rpc-url https://rpc.monad.xyz \
    --broadcast \
    --verify \
    --etherscan-api-key $MONAD_ETHERSCAN_API_KEY

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo "✅ Smart contract deployed successfully!"

# Extract contract address from deployment logs
CONTRACT_ADDRESS=$(grep -o '0x[a-fA-F0-9]\{40\}' broadcast/Deploy.s.sol/143/run-latest.json | head -1)
echo "📝 Contract Address: $CONTRACT_ADDRESS"

# Update frontend configuration
cd ..
echo "⚙️ Updating frontend configuration..."

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOF
NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
EOF
    echo "📝 Created .env.local - Please update WALLETCONNECT_PROJECT_ID"
else
    # Update existing contract address
    if grep -q "NEXT_PUBLIC_CONTRACT_ADDRESS" .env.local; then
        sed -i.bak "s/NEXT_PUBLIC_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS/" .env.local
        rm .env.local.bak
    else
        echo "NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS" >> .env.local
    fi
    echo "📝 Updated contract address in .env.local"
fi

# Update contract configuration
cat > lib/contracts.ts << EOF
// Moonynads NFT Collection Contract Configuration - Auto-generated

export const MOONYNADS_CONTRACT = {
  address: '$CONTRACT_ADDRESS',
  abi: [
    // ERC721 Standard Functions
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function tokenURI(uint256 tokenId) view returns (string)',
    'function ownerOf(uint256 tokenId) view returns (address)',
    'function balanceOf(address owner) view returns (uint256)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
    
    // Moonynads Specific Functions
    'function mint(address to, uint256 tokenId) external',
    'function safeMint(address to, uint256 tokenId) external',
    'function setTokenURI(uint256 tokenId, string uri) external',
    'function pause() external',
    'function unpause() external',
    'function paused() view returns (bool)',
    
    // Advent Calendar Functions
    'function isAdventDay(uint256 day) view returns (bool)',
    'function mintAdventToken(uint256 day) external payable',
    'function getAdventTokenId(uint256 day) view returns (uint256)',
    'function isAdventTokenMinted(uint256 day, address user) view returns (bool)',
    
    // Rarity and Metadata
    'function getTokenRarity(uint256 tokenId) view returns (string)',
    'function getRarityCount(string rarity) view returns (uint256)',
    'function getMaxSupply() view returns (uint256)',
    
    // Events
    'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
    'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
    'event AdventTokenMinted(address indexed user, uint256 indexed day, uint256 indexed tokenId)',
    'event RarityRevealed(uint256 indexed tokenId, string rarity)'
  ]
} as const

// Rest of the configuration remains the same...
export const MOONYNAD_TOKEN_IDS = {
  moon: 1,
  moon2: 2,
  moon3: 3,
  heart: 4,
  lady: 5,
  chudnovsky: 6,
  headupbutt: 7,
  multi: 8,
  xl: 9
} as const

export const RARITY_CONFIG = {
  common: { color: '#9CA3AF', supply: 1000 },
  uncommon: { color: '#10B981', supply: 500 },
  rare: { color: '#3B82F6', supply: 250 },
  epic: { color: '#EF4444', supply: 100 },
  legendary: { color: '#FFD700', supply: 50 }
} as const

export const ADVENT_CONFIG = {
  startDate: '2024-12-13',
  endDate: '2024-12-24',
  mintPrice: '0.001',
  dailyLimit: 100
} as const
EOF

echo "✅ Contract configuration updated"

# Build and test frontend
echo "🏗️ Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend built successfully"

# Final summary
echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo "Contract Address: $CONTRACT_ADDRESS"
echo "Network: Monad Mainnet (Chain ID: 143)"
echo "Explorer: https://monadvision.com/address/$CONTRACT_ADDRESS"
echo ""
echo "Next steps:"
echo "1. Update WALLETCONNECT_PROJECT_ID in .env.local"
echo "2. Deploy frontend to your hosting platform"
echo "3. Test the minting functionality"
echo "4. Announce your collection!"
echo ""
echo "🌙 Happy minting!"