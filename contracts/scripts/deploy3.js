const { ethers } = require("hardhat");

async function main() {
   const router = "0x554472a2720e5e7d5d3c817529aba05eed5f82d8"
   const routerMumbai = "0x70499c328e1e2a3c41108bd3730f6670a44595d1"
  const functionsRouter = "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0"
  const sid = BigInt(1619)
  const ccipDns = await ethers.deployContract("ccipDNS", [routerMumbai, functionsRouter, sid]);
  console.log("ccipDNS deployed to:", ccipDns.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
