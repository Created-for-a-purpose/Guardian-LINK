const { ethers } = require("hardhat");

async function main() {
  const gWars = await ethers.deployContract("GuardianWars", [832]);
  console.log("Guardian wars deployed to:", gWars.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
