// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RiscZero/RiscZeroGroth16Verifier.sol";

struct fheBalance {
    uint256[] cipher;
    uint256 uintRep;
}

contract USDCmock is IERC20, RiscZeroGroth16Verifier, Ownable {
    mapping(address => fheBalance) private fheBalances;
    uint256 private _totalSupply;
    string public constant name = "mock-USDC";
    string public constant symbol = "USDC";

    constructor() Ownable(msg.sender) {}

    function mint(address _to, uint256[] calldata _cipher) external onlyOwner {
        uint256 uintRep = getUintRep(_cipher);
        fheBalances[_to].cipher = _cipher;
        fheBalances[_to].uintRep = uintRep;
    }

    function getFheBalance(
        address _address
    ) public view returns (fheBalance memory) {
        return fheBalances[_address];
    }

    function getUintRep(
        uint256[] memory _cipher
    ) public pure returns (uint256) {
        bytes32 bytesRep = keccak256(abi.encodePacked(_cipher));
        uint256 uintRep = uint256(bytesRep) & ((1 << 256) - 1);
        return uintRep;
    }

    struct guestReceipt {
        bool RISC0_DEV_MODE;
        bytes seal;
        bytes32 imageId;
        bytes32 postStateDigest;
        bytes32 journalHash;
    }

    function transfer(
        address recipient,
        uint256[] calldata cipher_sender,
        uint256[] calldata cipher_recipient,
        guestReceipt calldata receipt
    ) external returns (bool) {
        require(
            receipt.RISC0_DEV_MODE ||
                verify(
                    receipt.seal,
                    receipt.imageId,
                    receipt.postStateDigest,
                    receipt.journalHash
                ),
            "Invalid receipt!"
        );
        uint256 uintRep_sender = getUintRep(cipher_sender);
        uint256 uintRep_recipient = getUintRep(cipher_recipient);
        fheBalances[msg.sender].cipher = cipher_sender;
        fheBalances[msg.sender].uintRep = uintRep_sender;
        fheBalances[recipient].cipher = cipher_recipient;
        fheBalances[recipient].uintRep = uintRep_recipient;
        return true;
    }

    function transferCrosschain(
        bool receipient,
        address entity,
        uint256[] calldata cipher_sender,
        uint256[] calldata cipher_recipient,
        guestReceipt calldata receipt
    ) external returns (bool) {
        require(
            receipt.RISC0_DEV_MODE ||
                verify(
                    receipt.seal,
                    receipt.imageId,
                    receipt.postStateDigest,
                    receipt.journalHash
                ),
            "Invalid receipt!"
        );
        if (receipient) {
            uint256 uintRep_recipient = getUintRep(cipher_recipient);
            fheBalances[entity].cipher = cipher_recipient;
            fheBalances[entity].uintRep = uintRep_recipient;
            return true;
        }
        uint256 uintRep_sender = getUintRep(cipher_sender);
        fheBalances[entity].cipher = cipher_sender;
        fheBalances[entity].uintRep = uintRep_sender;

        return true;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return fheBalances[account].uintRep;
    }

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool) {
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool) {
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        return true;
    }

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256) {
        return 0;
    }
}
