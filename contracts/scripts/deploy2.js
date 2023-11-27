const { ethers } = require("hardhat");

async function main() {
  const routerAddress = "0x554472a2720e5e7d5d3c817529aba05eed5f82d8"
  const mockUsdc = "0x7cD40F7b76CE58DC28324270c35A54c9d9A1C4f2"
  const routermumbai = "0x70499c328e1e2a3c41108bd3730f6670a44595d1"
  const mockUsdcmumbai = "0xC2d6130c156fC425bb6310a24827772F6035d759"
  const ccipGuardian = await ethers.deployContract("CCIPguardian", [routerAddress, mockUsdc], {
    value: ethers.parseEther("0.2"),
  });
  // await ccipGuardian.waitForDeployment();
  console.log('ccip guardian deployed to:', ccipGuardian.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
