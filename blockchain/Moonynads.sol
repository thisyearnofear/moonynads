// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Moonynads
 * @dev ERC721 NFT contract for the Moonynads ASCII Art Collection with Advent Calendar functionality
 */
contract Moonynads is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Pausable, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant ADVENT_MINT_PRICE = 0.001 ether; // 0.001 MON
    uint256 public constant ADVENT_DAILY_LIMIT = 100;
    
    uint256 public currentTokenId = 0;
    
    // Advent Calendar Configuration
    uint256 public constant ADVENT_START_DAY = 13; // December 13th
    uint256 public constant ADVENT_END_DAY = 24;   // December 24th
    
    // Mapping from advent day to token ID
    mapping(uint256 => uint256) public adventDayToTokenId;
    
    // Mapping to track if user minted advent token for specific day
    mapping(uint256 => mapping(address => bool)) public adventTokenMinted;
    
    // Mapping from day to number of tokens minted
    mapping(uint256 => uint256) public adventDayMintCount;
    
    // Token rarity mapping
    mapping(uint256 => string) public tokenRarity;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Events
    event AdventTokenMinted(address indexed user, uint256 indexed day, uint256 indexed tokenId);
    event RaritySet(uint256 indexed tokenId, string rarity);
    event BaseURIUpdated(string newBaseURI);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
        
        // Initialize advent day mappings
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
        adventDayToTokenId[20] = 8;  // hips
        adventDayToTokenId[21] = 9;  // l
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
     * @dev Mint an advent calendar token for the current day
     */
    function mintAdventToken(uint256 day) external payable nonReentrant whenNotPaused {
        require(isAdventDay(day), "Invalid advent day");
        require(msg.value >= ADVENT_MINT_PRICE, "Insufficient payment");
        require(!adventTokenMinted[day][msg.sender], "Already minted for this day");
        require(adventDayMintCount[day] < ADVENT_DAILY_LIMIT, "Daily limit reached");
        
        // Get the base token ID for this day
        uint256 baseTokenId = adventDayToTokenId[day];
        require(baseTokenId > 0, "Token ID not set for this day");
        
        // Create unique token ID: baseTokenId * 1000 + mint count for this day
        uint256 tokenId = baseTokenId * 1000 + adventDayMintCount[day];
        
        // Mint the token
        _safeMint(msg.sender, tokenId);
        
        // Set token URI
        _setTokenURI(tokenId, string(abi.encodePacked(_baseTokenURI, "/", _toString(tokenId), ".json")));
        
        // Mark as minted for this user and day
        adventTokenMinted[day][msg.sender] = true;
        
        // Increment daily mint count
        adventDayMintCount[day]++;
        
        // Set rarity based on mint order
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