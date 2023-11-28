require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    avalanche_fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [process.env.PRIVATE_KEY],
    },
    mumbai: {
      url: "https://polygon-mumbai-bor.publicnode.com",
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.8.20",
      },
    ]
  },
};
