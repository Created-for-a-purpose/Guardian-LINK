// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct fheBalance {
    uint256[] cipher;
    uint256 uintRep;
}

contract USDCmock is ERC20, Ownable {
    mapping(address => fheBalance) private fheBalances;

    constructor() ERC20("USDC", "USDC") Ownable(msg.sender) {}

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }

    function getFheBalance(
        address _address
    ) public view returns (fheBalance memory) {
        return fheBalances[_address];
    }

    function getUintRep(
        uint256[] memory _cipher
    ) public pure returns (uint256) {
        bytes32 memory bytesRep = keccak256(abi.encodePacked(_cipher));
        uint256 uintRep = uint256(bytesRep) & ((1 << 256) - 1);
        return uintRep;
    }

    function transfer(
        address recipient,
        uint256[] calldata cipher_sender,
        uint256[] calldata cipher_recipient
        /*@dev receipt */
    ) external 
    {
        uint256 uintRep_sender = getUintRep(cipher_sender);
        uint256 uintRep_recipient = getUintRep(cipher_recipient);
        fheBalances[msg.sender].cipher = cipher_sender;
        fheBalances[msg.sender].uintRep = uintRep_sender;
        fheBalances[recipient].cipher = cipher_recipient;
        fheBalances[recipient].uintRep = uintRep_recipient;
    }
}
