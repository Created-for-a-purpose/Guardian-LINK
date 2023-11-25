import "./FhePay.css"
import { UsdcSVG, DaiSVG, FujiSVG, MumbaiSVG } from "./CustomSVG"
import { Button, Dialog, Typography, Helper, Input, Select, Banner } from "@ensdomains/thorin";
import { EthTransparentSVG, EyeStrikethroughSVG, EyeSVG, WalletSVG, AeroplaneSVG } from "@ensdomains/thorin";
import { useState } from "react";

function FhePay({ ens }) {
    const [state, setState] = useState('dialog')
    const getState = _state => state === _state;

    const [isEncrypted, setIsEncrypted] = useState(true)

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
                            Your balance: 725654469346795767 USDC
                        </div>
                        <div style={{display: 'flex', alignItems:'center', gap:'10px'}}>
                        {isEncrypted ? (<EyeSVG className="decrypt" shouldShowTooltipIndicator
                            onClick={() => setIsEncrypted(!isEncrypted)} />) :
                            (<EyeStrikethroughSVG className="decrypt" shouldShowTooltipIndicator
                                onClick={() => setIsEncrypted(!isEncrypted)} />)}
                        <Typography fontVariant="extraSmall">{isEncrypted?(`(Reveal)`):(`(Conceal)`)}</Typography>
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
                <Button width="32" colorStyle="blueGradient" prefix={<AeroplaneSVG />}>Send</Button>
            </Dialog>
        </>
    )
}

export default FhePay;