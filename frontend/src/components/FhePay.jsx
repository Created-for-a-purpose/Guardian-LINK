import "./FhePay.css"
import { UsdcSVG, DaiSVG, FujiSVG, MumbaiSVG } from "./CustomSVG"
import { Button, Dialog, Typography, Helper, Input, Select, Banner, Toast } from "@ensdomains/thorin";
import { EthTransparentSVG, EyeStrikethroughSVG, EyeSVG, WalletSVG, AeroplaneSVG } from "@ensdomains/thorin";
import { useEffect, useState } from "react";
import { usdcFuji, usdcAbi, ccipGuardianFuji, ccipGuardianAbi, ccipGuardianMumbai } from "../utils/constants"
import { readContract, writeContract } from "wagmi/actions"
import { useAccount, useChainId } from "wagmi"
import { dbUser } from "../utils/polybase"
import lighthouse from '@lighthouse-web3/sdk';
import { signMessage } from "@wagmi/core";
import { hashMessage, parseUnits } from "viem";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

function FhePay({ ens }) {
    const chainId = useChainId()
    const addRecentTransaction = useAddRecentTransaction();
    const { address } = useAccount()
    const [toast, setToast] = useState('no-toast')
    const getToastState = _state => _state === toast
    const [state, setState] = useState('dialog')
    const getState = _state => state === _state;
    const [cciptx, setCciptx] = useState('')

    const [isEncrypted, setIsEncrypted] = useState(true)
    const [balance, setBalance] = useState(0)
    const [decryptedBalance, setDecryptedBalance] = useState('')
    const [sendAmount, setSendAmount] = useState('')
    const [txChain, setTxChain] = useState('')

    useEffect(() => {
        async function getBalance() {
            try {
                if (chainId == '80001') {
                    ccbalance()
                    return
                }
                const balance = await readContract({
                    address: usdcFuji,
                    abi: usdcAbi,
                    functionName: "balanceOf",
                    args: [address]
                })
                if (balance?.toString() !== "0")
                    setBalance(balance?.toString().slice(0, 18))
                else setBalance(balance?.toString())
            }
            catch (err) {
                console.log(err)
            }
        }
        getBalance()
    }, [state, address])

    const ccbalance = async () => {
        const cid = await readContract({
            address: ccipGuardianMumbai,
            abi: ccipGuardianAbi,
            functionName: "ccfheBalances",
            args: [address]
        })
        console.log('ccid', cid)
        if (cid == "") return 0
        const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`)
        const cipher = await response.json()
        console.log('cipher', cipher)
        setBalance(cipher.slice(0, 10))
        return cipher
    }

    const encryptionSignature = async () => {
        const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
        const signedMessage = await signMessage({ message: messageRequested });
        return ({
            signedMessage: signedMessage,
            publicKey: address
        });
    }

    const getSecretKey = async (cid) => {
        const { publicKey, signedMessage } = await encryptionSignature();
        const keyObject = await lighthouse.fetchEncryptionKey(
            cid,
            publicKey,
            signedMessage
        );
        const decrypted = await lighthouse.decryptFile(cid, keyObject?.data?.key);
        const reader = new FileReader();
        reader.readAsText(decrypted);
        return new Promise((resolve, reject) => {
            reader.onload = () => {
                const skey = JSON.parse(reader.result);
                resolve(skey?.sk);
            };
            reader.onerror = reject;
        });
    }

    const encrypt = async (address, plaintext) => {
        const url = 'http://localhost:8000/encrypt';
        const pkey = await dbUser.record(address).get().then(res => res?.data?.pkey)
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "key": JSON.parse(pkey)?.pk,
                    "plaintext": plaintext
                }),
            });
            const ciphertext = await response.json();
            return ciphertext
        }
        catch (err) {
            console.log(err)
        }
    }

    const getCipherBalance = async (address) => {
        if (chainId == '80001') return ccbalance()
        const ciphertext = await readContract({
            address: usdcFuji,
            abi: usdcAbi,
            functionName: "getFheBalance",
            args: [address]
        })
        if (ciphertext?.uintRep?.toString() === "0") {
            const bal = await encrypt(address, 0)
            return bal
        }
        const cipher = new Uint8Array(ciphertext.cipher.map(Number))
        return Array.from(cipher)
    }

    const decrypt = async () => {
        if (balance === 0) return
        const userData = await dbUser.record(address).get()
        const skeyPayload = JSON.parse(userData?.data?.skey)
        const skey_cid = skeyPayload?.data?.Hash
        const skey = await getSecretKey(skey_cid)
        const cipher = await getCipherBalance(address)

        const url = 'http://localhost:8000/decrypt';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "key": skey,
                    "ciphertext": cipher
                }),
            });
            const decryptedBalance = await response.json();
            setDecryptedBalance(decryptedBalance[0])
        }
        catch (err) {
            console.log(err)
        }

        setIsEncrypted(!isEncrypted)
    }

    const conceal = async () => {
        if (chainId == '80001') {
            ccbalance()
            setIsEncrypted(!isEncrypted)
            return
        }
        if (balance === 0) return
        const bal = await readContract({
            address: usdcFuji,
            abi: usdcAbi,
            functionName: "balanceOf",
            args: [address]
        })
        if (bal?.toString() !== "0")
            setBalance(bal?.toString().slice(0, 18))
        else setBalance(bal?.toString())
        setIsEncrypted(!isEncrypted)
    }

    const createTx = async () => {
        const url = 'http://localhost:8000/fhe_pay';
        const sampleReceiver = "0xA2e91Dde322d9213E6f8E0d36c8869D73ce27c94"
        const spk = await dbUser.record(address).get().then(res => res?.data?.pkey)
        const rpk = await dbUser.record(sampleReceiver).get().then(res => res?.data?.pkey)

        const scipher = await getCipherBalance(address)
        const rcipher = await getCipherBalance(sampleReceiver)

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "sender_pk": JSON.parse(spk)?.pk,
                    "sender_cipher_balance": Array.from(scipher),
                    "receiver_pk": JSON.parse(rpk)?.pk,
                    "receiver_cipher_balance": Array.from(rcipher),
                    "plaintext_amount": parseInt(sendAmount)
                }),
            });
            const fhePayResult = await response.json();
            sendTx(sampleReceiver, fhePayResult)
        }
        catch (err) {
            console.log(err)
        }
    }

    const sendTx = async (receiver, result) => {
        if (result?.sender_cipher_balance === undefined || result?.receiver_cipher_balance === undefined)
            return
        const bytes32 = hashMessage('dev mode')
        // Receipt from Risc0 zkVM
        const guestReceipt = {
            RISC0_DEV_MODE: true,
            seal: bytes32,
            imageId: bytes32,
            postStateDigest: bytes32,
            journalHash: bytes32,
        }
        if (txChain !== '' && txChain != chainId) {
            console.log('crosschain', txChain)
            sendCrossChainTx(receiver, result, guestReceipt)
            return
        }
        try {
            const tx = await writeContract({
                address: usdcFuji,
                abi: usdcAbi,
                functionName: "transfer",
                args: [receiver, result.sender_cipher_balance, result.receiver_cipher_balance, guestReceipt],
            })
            addRecentTransaction({
                hash: tx?.hash,
                description: 'FHE Pay'
            })
            setSendAmount('')
        }
        catch (err) {
            console.log(err)
        }
    }

    const sendCrossChainTx = async (receiver, result, guestReceipt) => {
        let contractAddress = ''
        let receiverContractAddress = ''
        let chainSelector = ''
        if (chainId == '43113') {
            contractAddress = ccipGuardianFuji
            receiverContractAddress = ccipGuardianMumbai
            chainSelector = '12532609583862916517'
        }
        else if (chainId == '80001') {
            contractAddress = ccipGuardianMumbai
            receiverContractAddress = ccipGuardianFuji
            chainSelector = '14767482510784806043'
        }
        try {
            const api = '8b8298ac.940174d0ee014e158ff730056ce793cc'
            const response = await lighthouse.uploadText(JSON.stringify(result.receiver_cipher_balance), api, address)
            if (response?.data?.Hash === undefined) return
            const receiverCipherBalance = response?.data?.Hash
            console.log(parseUnits(chainSelector, 0))
            const tx = await writeContract({
                address: contractAddress,
                abi: ccipGuardianAbi,
                functionName: "fhePayCrosschain",
                args: [parseUnits(chainSelector, 0), receiverContractAddress, receiver,
                result.sender_cipher_balance,
                    receiverCipherBalance,
                    guestReceipt
                ],
            })
            addRecentTransaction({
                hash: tx?.hash,
                description: 'FHE Pay crosschain'
            })
            setToast('toast')
            setCciptx(tx?.hash)
            setSendAmount('')
        }
        catch (err) {
            console.log(err)
        }
    }

    const mint = async () => {
        const cipher = await encrypt(address, 50)
        await writeContract({
            address: usdcFuji,
            abi: usdcAbi,
            functionName: "mint",
            args: [address, cipher],
        })
    }

    return (
        <>
            <Button onClick={() => setState('dialog-closable')} colorStyle='purpleGradient' width="28"
                prefix={<EthTransparentSVG />}>
                Pay
            </Button>
            <Dialog
                open={getState('dialog-closable')}
                title={`Paying ${ens}`}
                variant="closable"
                onDismiss={() => setState('dialog')}
                className="dialog"
            >
                <Typography><EyeStrikethroughSVG /> Private Transaction</Typography>
                <Helper type="info" alignment="horizontal">
                    Unencrypted transactions are vulnerable to MEV attacks!
                </Helper>
                <Banner alert="warning" iconType={"none"}>
                    <div className="balance_container">
                        <div className="balance">
                            Your balance: {isEncrypted || decryptedBalance === '' ? balance : decryptedBalance} USDC
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {isEncrypted ? (<EyeSVG className="decrypt" shouldShowTooltipIndicator
                                onClick={decrypt} />) :
                                (<EyeStrikethroughSVG className="decrypt" shouldShowTooltipIndicator
                                    onClick={conceal} />)}
                            <Typography fontVariant="extraSmall">{isEncrypted ? (`(Reveal)`) : (`(Conceal)`)}</Typography>
                        </div>
                    </div>
                </Banner>
                <div className="options">
                    <Select
                        label="Token"
                        description="Select the token to send"
                        options={[
                            { value: '1', label: 'USDC', prefix: <UsdcSVG /> },
                            { value: '2', label: 'DAI', prefix: <DaiSVG /> }
                        ]}
                        placeholder="..."
                    />
                    <Select
                        label="Chain"
                        description="Select destination chain"
                        options={[
                            { value: '43113', label: 'Avalanche Fuji', prefix: <FujiSVG /> },
                            { value: '80001', label: 'Polygon Mumbai', prefix: <MumbaiSVG /> }
                        ]}
                        onChange={(e) => setTxChain(e.target.value)}
                        placeholder="..."
                    />
                </div>
                <Toast
                    description="Confirmation might take a while."
                    open={getToastState('toast')}
                    title="Tx sent!"
                    variant="desktop"
                    onClose={() => setToast('no-toast')}
                >
                    <Button shadowless size="small" colorStyle="purpleGradient" as="a" href={`https://ccip.chain.link/tx/${cciptx}`}
                    rel="noreferrer" target="_blank">
                        View on CCIP
                    </Button>
                </Toast>
                <Input
                    label="Amount"
                    description="Enter the amount to send"
                    placeholder="..."
                    prefix={<WalletSVG />}
                    value={sendAmount}
                    onChange={e => setSendAmount(e.target.value)}
                />
                <Button width="32" colorStyle="blueGradient" prefix={<AeroplaneSVG />} onClick={createTx}>Send</Button>
            </Dialog>
        </>
    )
}

export default FhePay;