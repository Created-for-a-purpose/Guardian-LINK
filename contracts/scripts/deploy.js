const { ethers } = require("hardhat");

async function main() {
  const mockUsdc = await ethers.deployContract("USDCmock");
  // await mockUsdc.waitForDeployment();
  console.log('mockUsdc deployed to:', mockUsdc.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
