//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract ccipDNS is CCIPReceiver, FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;
    uint256 tokens = 0;
    mapping(uint256 => address) public tokenToAddress;
    mapping(uint256 => string) public tokenToMetadata;

    struct did {
        string name;
        uint256 tokenId;
    }
    mapping(address => did) public resolver;
    mapping(string => address) public nameToAddress;

    uint64 subscriptionId;
    bytes32 donId = 0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000;
    mapping(bytes32 => address) public SDreqs;

    constructor(
        address _router,
        address _functionsRouter,
        uint64 _sid
    ) CCIPReceiver(_router) FunctionsClient(_functionsRouter) {
        subscriptionId = _sid;
    }

    receive() external payable {}

    function _mint(string memory imageUrl, address minter) internal {
        uint256 _tokenId = tokens;
        tokenToAddress[_tokenId] = minter;
        tokenToMetadata[_tokenId] = imageUrl;
        resolver[minter].tokenId = _tokenId;
        tokens++;
    }

    string source = 
                    "const prompt = args[0];"
                    "const apiKey = args[1];"
                    "var myHeaders = new Headers();"
                    "myHeaders.append('Content-Type', 'application/json');"
                    "var raw = {"
                    "'key': `${apiKey}`,"
                    "'prompt': `${prompt}`,"
                    "'negative_prompt': null,"
                    "'width': '512',"
                    "'height': '512',"
                    "'samples': '1',"
                    "'num_inference_steps': '20',"
                    "'seed': null,"
                    "'guidance_scale': 7.5,"
                    "'safety_checker': 'yes',"
                    "'multi_lingual': 'no',"
                    "'panorama': 'no',"
                    "'self_attention': 'no',"
                    "'upscale': 'no',"
                    "'embeddings_model': null,"
                    "'webhook': null,"
                    "'track_id': null"
                    "};"
                    "const apiResponse = await Functions.makeHttpRequest({"
                    "method: 'POST',"
                    "url: `https://stablediffusionapi.com/api/v3/text2img`,"
                    "headers: myHeaders,"
                    "data: raw,"
                    "timeout: '8000 ms'"
                    "});"
                    "if (apiResponse.error) {"
                    "throw Error('Request failed');"
                    "}"
                    "const { data } = apiResponse;"
                    "return Functions.encodeString((data.output)[0])";

    function mint(string memory prompt, string memory key) external {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        string[] memory args = new string[](2);
        args[0] = prompt;
        args[1] = key;
        req.setArgs(args);
        uint32 gasLimit = 300000;
        uint64 sid = 1619;
        bytes32 rid = _sendRequest(
            req.encodeCBOR(),
            sid,
            gasLimit,
            donId
        );
        SDreqs[rid] = msg.sender;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        address requestor = SDreqs[requestId];
        require(requestor != address(0), "request not recognized");
        string memory imageUrl = string(response);
        _mint(imageUrl, requestor);
    }

    function _register(address sender, string memory name) internal {
        if (nameToAddress[name] != address(0)) revert("Already registered");

        resolver[sender] = did(name, 0);
        nameToAddress[name] = sender;
    }

    function register(
        string memory name,
        address receiver,
        uint64 destinationChainSelector
    ) external returns (bytes32 messageId) {
        _register(msg.sender, name);

        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver), // ABI-encoded receiver address
            data: abi.encode(name, msg.sender), // ABI-encoded function call
            tokenAmounts: new Client.EVMTokenAmount[](0), // Empty array aas no tokens are transferred
            extraArgs: Client._argsToBytes(
                // Additional arguments, setting gas limit and non-strict sequencing mode
                Client.EVMExtraArgsV1({gasLimit: 1_000_000, strict: false})
            ),
            feeToken: address(0)
        });

        IRouterClient router = IRouterClient(this.getRouter());
        uint256 fees = router.getFee(destinationChainSelector, evm2AnyMessage);

        if (fees > address(this).balance)
            revert("Not enough balance to pay for fees");

        // Send the CCIP message through the router and store the returned CCIP message ID
        messageId = router.ccipSend{value: fees}(
            destinationChainSelector,
            evm2AnyMessage
        );
        // Return the CCIP message ID
        return messageId;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        (string memory name, address sender) = abi.decode(
            any2EvmMessage.data,
            (string, address)
        );
        _register(sender, name);
    }
}