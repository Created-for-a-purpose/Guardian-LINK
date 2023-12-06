import React, { useEffect, useState } from "react";
import styles from "./Game.module.css";
import { useNavigate } from "react-router-dom";
import { guardianWars, guardianWarsAbi } from "../utils/constants"
import { ethers } from "ethers"

export default function Game() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const [footer, setFooter] = useState('')
    const navigate = useNavigate();
    let gWars;

    useEffect(() => {
        const setContract = async () => {
            const _contract = new ethers.Contract(guardianWars, guardianWarsAbi, await provider.getSigner())
            gWars = _contract
        }
        setContract()
        const detectEvent = async () => {
            if (!gWars) return
            try {
                const isStarted = await gWars.isGameStarted()
                if(!isStarted) return
                setFooter('Allotting characters and weapons...')
                const isInitialized = await gWars.arePlayersInitialized()
                if(isInitialized) navigate('./play');
            }
            catch (err) {
                console.log(err);
                return;
            }
        }
        detectEvent()
        const int = setInterval(() => {
            detectEvent()
        }, 8000)
        return () => {
            clearInterval(int)
        }
    }, [])

    const joinGame = async () => {
        const gWars = new ethers.Contract(guardianWars, guardianWarsAbi, await provider.getSigner())

        try {
            await gWars.joinGame();
            setFooter('Waiting for other players...')
            // await gWars.reset();
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={styles.game_container}>
            <h1>Guardian Wars</h1>
            <div className={styles.game_container__buttons}>
                <button className={styles.game_container__buttons__button} onClick={joinGame}>Play</button>
                <button className={styles.game_container__buttons__button}>Go Back</button>
            </div>
            {footer && <h2>{footer}</h2>}
        </div>
    );
};
