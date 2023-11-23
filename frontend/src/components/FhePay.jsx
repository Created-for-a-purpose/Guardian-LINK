import "./FhePay.css"
import { Button, Dialog, Typography, EthSVG, EyeStrikethroughSVG } from "@ensdomains/thorin";
import { useState } from "react";

function FhePay({ ens }) {
    const [state, setState] = useState('dialog')
    const getState = _state => state===_state;

    return (
        <>
            <Button onClick={() => setState('dialog-closable')} colorStyle='purpleGradient' width="28"
            prefix={<EthSVG/>}>
                Pay
            </Button>
            <Dialog
                open={getState('dialog-closable')}
                subtitle={`Paying ${ens}`}
                variant="closable"
                onDismiss={() => setState('dialog')}
            >
                <Typography><EyeStrikethroughSVG/> Private Transaction</Typography>
            </Dialog>
        </>
    )
}

export default FhePay;