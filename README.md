# Guardian-LINK
Guardian-LINK is an innovative integration of Social-Fi, MPC, FHE and ZK, and is designed to address a few problems and offer an inclusive social platform for linking with folks around the world.

## Problem-1
1. Lack of privacy-preserving Data Provenance
2. Standard TLS-based protocols securely communciate between a prover and a server. But what about involving a third party? (Verifier)
3. Associated risks with delegated access involve too much information been given out and control being in the hands of server, which means no data ownership.

This problem is addressed b Guardian-LINK using TLS notary, which uses multi-party computation allowing prover and notary to jointly manage a TLS connection, thereafter some portions of the data can be shown to verifer, redacting private components. Since, the notary was involved in MPC, data authenticity is guaranteed.

### Architecture
![Guardian-link-tls](https://github.com/Created-for-a-purpose/Guardian-LINK/assets/97793907/f34ec57b-1c10-461a-81cd-c99578efbbc5)

## Problem-2
1. Ensuring privacy: One of the most pressing challenges in the blockchain space due to its transparent nature.
2. There is a need for confidential smart contracts.
Associated risks of unencrypted transactions involve sensitive data exposure (token amounts, balance, etc.) and MEV extraction.

This problem is addressed by Guardian-LINK using FHE and Risc0-zkVM for verifiable computation. The zkVM generates a ZK proof for FHE operations execution inside it, so that it can be verified that all the computation was done correctly.

### Concept Simplified
Each party has a key pair of public key and secret for FHE encryption and decryption. These keys are stored in an encrypted manner on lighthouse, and the user can retrieve their keys by signing an authorization message. For transactions, user specifies a plaintext amount which is encrypted under the public keys of both sender and receiver and then there encrypted balance is updated using FHE, allowing no need for decryption at all.

![Guardian-FHE-overview (1)](https://github.com/Created-for-a-purpose/Guardian-LINK/assets/97793907/0e930d2f-d3e7-4339-95d8-f1776382b181)

### Architecture
![Guardian-FHE](https://github.com/Created-for-a-purpose/Guardian-LINK/assets/97793907/71406621-3441-49ca-a117-dd3e70b29b5f)

#### FHE unlocks many usecases:
1. Private token swaps
2. FHE rollups
3. Encrypted DIDs
4. Confidential gaming


The usecase of confidential gaming inspired me to create Guardian-Wars. A chainlink vrf secured and automation powered onchain game for maximizing user interaction on Guardian-LINK.

### Architecture of Guardian-Wars
![Guardian Wars](https://github.com/Created-for-a-purpose/Guardian-LINK/assets/97793907/dfdfd9b2-b988-4370-9026-31cda3745467)

## Components
#### Guardian X (Built for Guardian Auth) 
A browser extension for detecting response headers on X.com and injecting auth data to Guardian-LINK for notarization.
#### Guardian Auth 
Built using TLS notary for MPC based data provenance.
#### Guardian FHE
Built using FHE, Risc0-zkvm for verifiable computation and CCIP.
#### Guardian Wars
Built for maximizing user interaction by providing friendly onchain war games. Uses chainlink automation for checking contract state and requesting randomess from chainlink VRF.
#### All of the UI part is implemented with ENS Thorin.
