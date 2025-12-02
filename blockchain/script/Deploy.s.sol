// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../Moonynads.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying from address:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy Moonynads NFT contract
        Moonynads moonynads = new Moonynads(
            "Moonynads",
            "MOONY",
            "https://api.moonynads.xyz/metadata" // Base URI for metadata
        );
        
        console.log("Moonynads deployed at:", address(moonynads));
        
        vm.stopBroadcast();
        
        // Save deployment info
        string memory deploymentInfo = string.concat(
            "Moonynads Contract Address: ", vm.toString(address(moonynads)), "\n",
            "Network: Monad Mainnet (143)\n",
            "Deployer: ", vm.toString(deployer), "\n",
            "Block: ", vm.toString(block.number)
        );
        
        vm.writeFile("deployment.log", deploymentInfo);
        console.log("Deployment info saved to deployment.log");
    }
}