import React from "react";
import styles from "./PlayerAllotment.module.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CharacterCard from "../components/CharacterCard";
import WeaponCard from "../components/WeaponCard";
import characters from "../utils/characters.json";
import weapons from "../utils/weapons.json"
import { guardianWars, guardianWarsAbi } from "../utils/constants";
import { ethers } from "ethers"

export default function PlayerAllotment() {
    const [players, setPlayers] = useState(0);
    const [weapon, setWeapon] = useState(0);
    const [buttonText, setButtonText] = useState('Start')
    const navigate = useNavigate();
    const provider = new ethers.BrowserProvider(window.ethereum)
    let gWars;

    useEffect(() => {
        const setContract = async () => {
            const contract = new ethers.Contract(guardianWars, guardianWarsAbi, await provider.getSigner())
            gWars = contract
            try {
                const playerData = await contract.getCharacters()
                setPlayers(playerData[0][0])
                setWeapon(playerData[0][1])
            }
            catch (err) {
                console.log(err)
            }
        }
        setContract()
        const detectEvent = async () => {
            if (!gWars) return
            try {
                const randomnessGenerated = await gWars.getRandomness()
                if (randomnessGenerated?.toString() === '0') return
                navigate("/game/play-level");
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

    return (
        <div className={styles.player_allotment_container}>
            <h1>Guardian Wars</h1>
            <div className={styles.player_allotment_container__content}>
                <div className={styles.player_allotment_container__content__player}>
                    <CharacterCard character={players}></CharacterCard>
                </div>
                <div className={styles.player_allotment_container__content__body}>
                    <div className={styles.player_allotment_container__content__body__description}>
                        {characters[players].name}: {characters[players].description}
                    </div>
                    <div className={styles.player_allotment_container__content__body__weapon_container}>
                        <WeaponCard weapon={weapon}></WeaponCard>
                        <div className={styles.player_allotment_container__content__body__weapon_description}>
                            <p>
                                {weapons[weapon].name}: {weapons[weapon].description}
                            </p>
                            <p>
                                Special Attack: {weapons[weapon].attack}
                            </p>
                        </div>
                    </div>
                    <div className={styles.player_allotment_container__content__body__button_container}>
                        <div className={styles.stats}>
                            <p>
                                Health Points <br></br>10
                            </p>
                            <p>
                                Attack Points <br></br>10
                            </p>
                            <p>
                                Defense Points <br></br>10
                            </p>
                        </div>
                        <div className={styles.button_container}>
                            <button className={styles.button_container__button} onClick={() => setButtonText('Loading...')}>{buttonText}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
