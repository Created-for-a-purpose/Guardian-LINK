import "./FhePay.css"
import { UsdcSVG, DaiSVG, FujiSVG, MumbaiSVG } from "./CustomSVG"
import { Button, Dialog, Typography, Helper, Input, Select, Banner } from "@ensdomains/thorin";
import { EthTransparentSVG, EyeStrikethroughSVG, EyeSVG, WalletSVG, AeroplaneSVG } from "@ensdomains/thorin";
import { useEffect, useState } from "react";
import { usdcFuji, usdcAbi } from "../utils/constants"
import { readContract, writeContract } from "wagmi/actions"
import { useAccount } from "wagmi"
import { dbUser } from "../utils/polybase"
import lighthouse from '@lighthouse-web3/sdk';
import { signMessage } from "@wagmi/core";
import { hashMessage } from "viem";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

function FhePay({ ens }) {
    const addRecentTransaction = useAddRecentTransaction();
    const { address } = useAccount()
    const [state, setState] = useState('dialog')
    const getState = _state => state === _state;

    const [isEncrypted, setIsEncrypted] = useState(true)
    const [balance, setBalance] = useState(0)
    const [decryptedBalance, setDecryptedBalance] = useState('')
    const [sendAmount, setSendAmount] = useState('')

    useEffect(() => {
        async function getBalance() {
            try {
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
        if(result?.sender_cipher_balance === undefined || result?.receiver_cipher_balance === undefined)
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
                            { value: '1', label: 'Avalanche Fuji', prefix: <FujiSVG /> },
                            { value: '2', label: 'Polygon Mumbai', prefix: <MumbaiSVG /> }
                        ]}
                        placeholder="..."
                    />
                </div>
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