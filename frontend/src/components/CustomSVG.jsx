import usdc from "../images/usdc.svg"
import dai from "../images/dai.svg"
import fuji from "../images/fuji.svg"
import mumbai from "../images/mumbai.svg"

function UsdcSVG() {
    return (
        <img src={usdc} style={{ height: '25px', width: '25px' }} />
    )
}

function DaiSVG() {
    return (
        <img src={dai} style={{ height: '25px', width: '25px' }} />
    )
}

function FujiSVG() {
    return (
        <img src={fuji} style={{ height: '25px', width: '25px' }} />
    )
}

function MumbaiSVG() {
    return (
        <img src={mumbai} style={{ height: '25px', width: '25px' }} />
    )
}

export { UsdcSVG, DaiSVG, FujiSVG, MumbaiSVG };