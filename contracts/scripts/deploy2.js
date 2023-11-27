const { ethers } = require("hardhat");

async function main() {
  const routerAddress = "0x70499c328e1e2a3c41108bd3730f6670a44595d1"
  const mockUsdc = "0x6cD0613315B2602F33001c1CD18dE8313c565E8e"
  const ccipGuardian = await ethers.deployContract("CCIPguardian", [routerAddress, mockUsdc]);
//   await ccipGuardian.waitForDeployment();
  console.log('ccip guardian deployed to:', ccipGuardian.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
