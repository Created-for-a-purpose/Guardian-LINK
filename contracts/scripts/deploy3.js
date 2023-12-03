const { ethers } = require("hardhat");

async function main() {
   const router = "0x554472a2720e5e7d5d3c817529aba05eed5f82d8"
  const donId = "0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000"
  const functionsRouter = "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0"
  const destinationChainSelector = BigInt("12532609583862916517")
  const sid = BigInt(1619)
  const ccipDns = await ethers.deployContract("ccipDNS", [router, functionsRouter, sid, destinationChainSelector]);
  console.log("ccipDNS deployed to:", ccipDns.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
