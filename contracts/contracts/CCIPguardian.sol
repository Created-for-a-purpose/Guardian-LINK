// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";

interface IMockUsdc {
    function transferCrosschain(
        bool receipient,
        address entity,
        uint256[] calldata cipher_sender,
        uint256[] calldata cipher_recipient,
        guestReceipt calldata receipt
    ) external returns (bool);
}

struct guestReceipt {
    bool RISC0_DEV_MODE;
    bytes seal;
    bytes32 imageId;
    bytes32 postStateDigest;
    bytes32 journalHash;
}

contract CCIPguardian is CCIPReceiver {
    IMockUsdc private immutable mockUsdc;
    constructor(
        address _router,
        address _mockUsdc
    ) payable CCIPReceiver(_router) {
        mockUsdc = IMockUsdc(_mockUsdc);
    }

    receive() external payable {}

    function fhePayCrosschain(
        uint64 _destinationChainSelector,
        address _receiverContract,
        address receipient,
        uint256[] calldata cipher_sender,
        uint256[] calldata cipher_recipient,
        guestReceipt calldata receipt
    ) external returns (bytes32 messageId) {
        uint256[] memory empty = new uint256[](0); // For un-necessary payload
        mockUsdc.transferCrosschain(
            false,
            msg.sender,
            cipher_sender,
            empty,
            receipt
        );
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiverContract), // ABI-encoded receiver address
            data: abi.encode(
                true,
                receipient,
                empty,
                cipher_recipient,
                receipt.RISC0_DEV_MODE,
                receipt.seal,
                receipt.imageId,
                receipt.postStateDigest,
                receipt.journalHash
            ), // ABI-encoded function call
            tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array aas no tokens are transferred
            extraArgs: Client._argsToBytes(
                // Additional arguments, setting gas limit and non-strict sequencing mode
                Client.EVMExtraArgsV1({gasLimit: 1000_000, strict: false})
            ),
            feeToken: address(0)
        });

        // Initialize a router client instance to interact with cross-chain router
        IRouterClient router = IRouterClient(this.getRouter());

        // Get the fee required to send the CCIP message
        uint256 fees = router.getFee(_destinationChainSelector, evm2AnyMessage);

        if (fees > address(this).balance)
            revert("Not enough balance to pay for fees");

        // Send the CCIP message through the router and store the returned CCIP message ID
        messageId = router.ccipSend{value: fees}(
            _destinationChainSelector,
            evm2AnyMessage
        );
        // Return the CCIP message ID
        return messageId;
    }

    /// handle a received message
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        (
            bool receipient,
            address entity,
            uint256[] memory cipher_sender,
            uint256[] memory cipher_recipient,
            bool RISC0_DEV_MODE,
            bytes memory seal,
            bytes32 imageId,
            bytes32 postStateDigest,
            bytes32 journalHash
        ) = abi.decode(
                any2EvmMessage.data,
                (bool, address, uint256[], uint256[], bool, bytes, bytes32, bytes32, bytes32)
            );
        guestReceipt memory receipt = guestReceipt({
            RISC0_DEV_MODE: RISC0_DEV_MODE,
            seal: seal,
            imageId: imageId,
            postStateDigest: postStateDigest,
            journalHash: journalHash
        });
        mockUsdc.transferCrosschain(
            receipient,
            entity,
            cipher_sender,
            cipher_recipient,
            receipt
        );
    }
}
