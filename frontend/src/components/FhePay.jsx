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

function FhePay({ ens }) {
    const { address } = useAccount()
    const [state, setState] = useState('dialog')
    const getState = _state => state === _state;

    const [isEncrypted, setIsEncrypted] = useState(true)
    const [balance, setBalance] = useState(0)
    const [decryptedBalance, setDecryptedBalance] = useState('')

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

    const decrypt = async () => {
        if (balance === 0) return
        const userData = await dbUser.record(address).get()
        const skeyPayload = JSON.parse(userData?.data?.skey)
        const skey_cid = skeyPayload?.data?.Hash
        const skey = await getSecretKey(skey_cid)
        const ciphertext = await readContract({
            address: usdcFuji,
            abi: usdcAbi,
            functionName: "getFheBalance",
            args: [address]
        })
        const cipher = new Uint8Array(ciphertext.cipher.map(Number))

        const url = 'http://localhost:8000/decrypt';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "key": skey,
                    "ciphertext": Array.from(cipher)
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

    const sendTx = async () => {
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
                            Your balance: {isEncrypted||decryptedBalance===''?balance:decryptedBalance} USDC
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
                />
                <Button width="32" colorStyle="blueGradient" prefix={<AeroplaneSVG />} onClick={sendTx}>Send</Button>
            </Dialog>
        </>
    )
}

export default FhePay;