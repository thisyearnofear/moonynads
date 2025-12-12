// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Moonynads
 * @dev ERC721 NFT contract for the Moonynads ASCII Art Collection with Advent Calendar functionality
 */
contract Moonynads is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Pausable, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant ADVENT_DAILY_LIMIT = 100;
    
    uint256 public currentTokenId = 0;
    
    // Advent Calendar Configuration
    uint256 public constant ADVENT_START_DAY = 13;
    uint256 public constant ADVENT_END_DAY = 24;
    
    // Payment Configuration
    IERC20 public m00nadToken;
    uint256 public constant MINT_PRICE_M00NAD = 100_000_000; // 100M m00nad tokens
    uint256 public constant DISCOUNT_PRICE_M00NAD = 50_000_000; // 50M m00nad (allowlist discount)
    
    // Allowlist Configuration
    mapping(address => uint256) public allowlistTier; // 0=none, 1=discount, 2=free
    mapping(uint256 => mapping(address => bool)) public allowlistMinted; // allowlist mint tracking per day
    
    // Mappings for advent mechanics
    mapping(uint256 => uint256) public adventDayToTokenId;
    mapping(uint256 => mapping(address => bool)) public adventTokenMinted;
    mapping(uint256 => uint256) public adventDayMintCount;
    mapping(uint256 => string) public tokenRarity;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Events
    event AdventTokenMinted(address indexed user, uint256 indexed day, uint256 indexed tokenId);
    event RaritySet(uint256 indexed tokenId, string rarity);
    event BaseURIUpdated(string newBaseURI);
    event AllowlistUpdated(address[] indexed addresses, uint256[] tiers);
    event AllowlistMint(address indexed user, uint256 indexed day, uint256 tier);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        address _m00nadToken
    ) ERC721(name, symbol) Ownable(msg.sender) {
        require(_m00nadToken != address(0), "Invalid token address");
        m00nadToken = IERC20(_m00nadToken);
        _baseTokenURI = baseURI;
        _initializeAdventTokenIds();
    }
    
    /**
     * @dev Initialize the mapping of advent days to token IDs
     */
    function _initializeAdventTokenIds() private {
        adventDayToTokenId[13] = 1;  // moon
        adventDayToTokenId[14] = 2;  // moon2
        adventDayToTokenId[15] = 3;  // moon3
        adventDayToTokenId[16] = 4;  // heart
        adventDayToTokenId[17] = 5;  // lady
        adventDayToTokenId[18] = 6;  // chudnovsky
        adventDayToTokenId[19] = 7;  // headupbutt
        adventDayToTokenId[22] = 10; // m
        adventDayToTokenId[23] = 11; // multi
        adventDayToTokenId[24] = 12; // s
    }

    /**
     * @dev Check if it's a valid advent calendar day
     */
    function isAdventDay(uint256 day) public pure returns (bool) {
        return day >= ADVENT_START_DAY && day <= ADVENT_END_DAY;
    }

    /**
     * @dev Mint an advent calendar token with $m00nad payment
     */
    function mintAdventToken(uint256 day) external nonReentrant whenNotPaused {
        require(isAdventDay(day), "Invalid advent day");
        require(!adventTokenMinted[day][msg.sender], "Already minted for this day");
        require(adventDayMintCount[day] < ADVENT_DAILY_LIMIT, "Daily limit reached");
        
        // Require m00nad token transfer
        require(
            m00nadToken.transferFrom(msg.sender, address(this), MINT_PRICE_M00NAD),
            "Token transfer failed"
        );
        
        _executeMint(day);
    }

    /**
     * @dev Mint with allowlist benefits (discount or free)
     */
    function mintAdventTokenAllowlist(uint256 day) external nonReentrant whenNotPaused {
        uint256 tier = allowlistTier[msg.sender];
        require(tier > 0, "Not on allowlist");
        require(isAdventDay(day), "Invalid advent day");
        require(!allowlistMinted[day][msg.sender], "Already minted for this day");
        require(adventDayMintCount[day] < ADVENT_DAILY_LIMIT, "Daily limit reached");
        
        // Tier 1: Discount (50M m00nad)
        if (tier == 1) {
            require(
                m00nadToken.transferFrom(msg.sender, address(this), DISCOUNT_PRICE_M00NAD),
                "Token transfer failed"
            );
        }
        // Tier 2: Free (no transfer needed)
        
        allowlistMinted[day][msg.sender] = true;
        emit AllowlistMint(msg.sender, day, tier);
        
        _executeMint(day);
    }

    /**
     * @dev Internal function to execute mint logic (DRY)
     */
    function _executeMint(uint256 day) internal {
        uint256 baseTokenId = adventDayToTokenId[day];
        require(baseTokenId > 0, "Token ID not set for this day");
        
        uint256 tokenId = baseTokenId * 1000 + adventDayMintCount[day];
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked(_baseTokenURI, "/", _toString(tokenId), ".json")));
        adventTokenMinted[day][msg.sender] = true;
        adventDayMintCount[day]++;
        _setTokenRarity(tokenId, _calculateRarity(adventDayMintCount[day]));
        
        emit AdventTokenMinted(msg.sender, day, tokenId);
    }

    /**
     * @dev Calculate rarity based on mint position
     */
    function _calculateRarity(uint256 mintPosition) private pure returns (string memory) {
        if (mintPosition <= 5) return "legendary";
        if (mintPosition <= 15) return "epic";
        if (mintPosition <= 35) return "rare";
        if (mintPosition <= 70) return "uncommon";
        return "common";
    }

    /**
     * @dev Set token rarity
     */
    function _setTokenRarity(uint256 tokenId, string memory rarity) private {
        tokenRarity[tokenId] = rarity;
        emit RaritySet(tokenId, rarity);
    }

    /**
     * @dev Get token rarity
     */
    function getTokenRarity(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenRarity[tokenId];
    }

    /**
     * @dev Set allowlist tiers for addresses (owner only)
     */
    function setAllowlist(address[] calldata addresses, uint256[] calldata tiers) 
        external 
        onlyOwner 
    {
        require(addresses.length == tiers.length, "Array length mismatch");
        require(addresses.length > 0, "Empty arrays");
        
        for (uint256 i = 0; i < addresses.length; i++) {
            require(addresses[i] != address(0), "Invalid address");
            require(tiers[i] <= 2, "Invalid tier (must be 0, 1, or 2)");
            allowlistTier[addresses[i]] = tiers[i];
        }
        
        emit AllowlistUpdated(addresses, tiers);
    }

    /**
     * @dev Get allowlist tier for an address
     */
    function getAllowlistTier(address user) external view returns (uint256) {
        return allowlistTier[user];
    }

    /**
     * @dev Check if user is on allowlist
     */
    function isAllowlisted(address user) external view returns (bool) {
        return allowlistTier[user] > 0;
    }

    /**
     * @dev Check if user has minted advent token for specific day
     */
    function isAdventTokenMinted(uint256 day, address user) external view returns (bool) {
        return adventTokenMinted[day][user];
    }

    /**
     * @dev Get advent token ID for a specific day
     */
    function getAdventTokenId(uint256 day) external view returns (uint256) {
        require(isAdventDay(day), "Invalid advent day");
        return adventDayToTokenId[day];
    }

    /**
     * @dev Owner mint function for special events
     */
    function ownerMint(address to, uint256 tokenId, string memory rarity) external onlyOwner {
        require(tokenId > 0, "Invalid token ID");
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked(_baseTokenURI, "/", _toString(tokenId), ".json")));
        _setTokenRarity(tokenId, rarity);
    }

    /**
     * @dev Set base URI for metadata
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }

    /**
     * @dev Pause contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Convert uint256 to string
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    // The following functions are overrides required by Solidity.
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}