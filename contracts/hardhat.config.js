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
      url: "https://indulgent-shy-aura.matic-testnet.discover.quiknode.pro/f3eadc815d04049d61d581cc6e1f6a6f152c7eec",
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
