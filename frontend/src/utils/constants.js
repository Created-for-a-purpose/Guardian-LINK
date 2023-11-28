export const usdcFuji = "0xd46162E341fa294733367CEfF91A45DBE94315b9"
export const usdcAbi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "CONTROL_ID_0",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "CONTROL_ID_1",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "uint256[]",
                "name": "cipher_recipient",
                "type": "uint256[]"
            },
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "RISC0_DEV_MODE",
                        "type": "bool"
                    },
                    {
                        "internalType": "bytes",
                        "name": "seal",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "imageId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "postStateDigest",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "journalHash",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct USDCmock.guestReceipt",
                "name": "receipt",
                "type": "tuple"
            }
        ],
        "name": "_updateReceiverCrosschain",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256[]",
                "name": "cipher_sender",
                "type": "uint256[]"
            },
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "RISC0_DEV_MODE",
                        "type": "bool"
                    },
                    {
                        "internalType": "bytes",
                        "name": "seal",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "imageId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "postStateDigest",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "journalHash",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct USDCmock.guestReceipt",
                "name": "receipt",
                "type": "tuple"
            }
        ],
        "name": "_updateSenderCrosschain",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "getFheBalance",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256[]",
                        "name": "cipher",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "uintRep",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct fheBalance",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256[]",
                "name": "_cipher",
                "type": "uint256[]"
            }
        ],
        "name": "getUintRep",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256[]",
                "name": "_cipher",
                "type": "uint256[]"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256[]",
                "name": "cipher_sender",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "cipher_recipient",
                "type": "uint256[]"
            },
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "RISC0_DEV_MODE",
                        "type": "bool"
                    },
                    {
                        "internalType": "bytes",
                        "name": "seal",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "imageId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "postStateDigest",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "journalHash",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct USDCmock.guestReceipt",
                "name": "receipt",
                "type": "tuple"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bytes",
                        "name": "seal",
                        "type": "bytes"
                    },
                    {
                        "components": [
                            {
                                "internalType": "bytes32",
                                "name": "preStateDigest",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "postStateDigest",
                                "type": "bytes32"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "enum SystemExitCode",
                                        "name": "system",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "uint8",
                                        "name": "user",
                                        "type": "uint8"
                                    }
                                ],
                                "internalType": "struct ExitCode",
                                "name": "exitCode",
                                "type": "tuple"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "input",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "output",
                                "type": "bytes32"
                            }
                        ],
                        "internalType": "struct ReceiptMetadata",
                        "name": "meta",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct Receipt",
                "name": "receipt",
                "type": "tuple"
            }
        ],
        "name": "verify",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "seal",
                "type": "bytes"
            },
            {
                "internalType": "bytes32",
                "name": "imageId",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "postStateDigest",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "journal",
                "type": "bytes"
            }
        ],
        "name": "verify",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "seal",
                "type": "bytes"
            },
            {
                "internalType": "bytes32",
                "name": "imageId",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "postStateDigest",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "journalHash",
                "type": "bytes32"
            }
        ],
        "name": "verify",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256[2]",
                "name": "_pA",
                "type": "uint256[2]"
            },
            {
                "internalType": "uint256[2][2]",
                "name": "_pB",
                "type": "uint256[2][2]"
            },
            {
                "internalType": "uint256[2]",
                "name": "_pC",
                "type": "uint256[2]"
            },
            {
                "internalType": "uint256[4]",
                "name": "_pubSignals",
                "type": "uint256[4]"
            }
        ],
        "name": "verifyProof",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

export const ccipGuardianFuji = "0xB6844f180C10D04fC137862Df895D25C8f71AA1e"
export const ccipGuardianMumbai = "0x91A8D582073A5e3d0f2c47Aa8ADA7A3567C4F80B"
export const ccipGuardianAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_router",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_mockUsdc",
                "type": "address"
            }
        ],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "router",
                "type": "address"
            }
        ],
        "name": "InvalidRouter",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "ccfheBalances",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "messageId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "sourceChainSelector",
                        "type": "uint64"
                    },
                    {
                        "internalType": "bytes",
                        "name": "sender",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct Client.EVMTokenAmount[]",
                        "name": "destTokenAmounts",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct Client.Any2EVMMessage",
                "name": "message",
                "type": "tuple"
            }
        ],
        "name": "ccipReceive",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "_destinationChainSelector",
                "type": "uint64"
            },
            {
                "internalType": "address",
                "name": "_receiverContract",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            },
            {
                "internalType": "uint256[]",
                "name": "cipher_sender",
                "type": "uint256[]"
            },
            {
                "internalType": "string",
                "name": "cipher_recipient",
                "type": "string"
            },
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "RISC0_DEV_MODE",
                        "type": "bool"
                    },
                    {
                        "internalType": "bytes",
                        "name": "seal",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "imageId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "postStateDigest",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "journalHash",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct guestReceipt",
                "name": "receipt",
                "type": "tuple"
            }
        ],
        "name": "fhePayCrosschain",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "messageId",
                "type": "bytes32"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRouter",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]