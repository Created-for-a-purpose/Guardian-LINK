import React, { useState } from "react";
import styles from "./GamePlay.module.css"
import CharacterCard from '../components/CharacterCard';
import WeaponCard from "../components/WeaponCard";


export default function GamePlay() {
    const [turn, setTurn] = useState(1);
    return (
        <div className={styles.container}>
            <div className={styles.player_container}>
                <p className={styles.turn}>{turn === 1 ? "Attacking!" : "Defending"}</p>
                <CharacterCard character={1}></CharacterCard>
                <WeaponCard></WeaponCard>
            </div>

            <div className={styles.player_attacks}>
                <div className={styles.health}>
                            <div className={styles.health_player1}>
                                <p>
                                    10 ❤️
                                </p>
                                <p>
                                    10 ⚔️
                                </p>
                                <p>
                                    10 🛡️
                                </p>
                            </div>
                            <div className={styles.health_player2}>
                                <p>
                                    10 ❤️
                                </p>
                                <p>
                                    10 ⚔️
                                </p>
                                <p>
                                    10 🛡️
                                </p>

                            </div>
                </div>
                <div className={styles.move_result}>
                    <p>
                        Critical Hit!
                    </p>
                    <p>
                        10 damage
                    </p>
                </div>
                <div className={styles.player_moves}>
                    <button className={styles.attack_btn}>Attack 1</button>
                    <button className={styles.attack_btn}>Attack 2</button>
                    <button className={styles.attack_btn}>Attack 3</button>
                    <button className={styles.attack_btn}>Attack 4</button>
                </div>
            </div>
            <div className={styles.player_container}>
                <p className={styles.turn}>{turn === 0 ? "Attacking!" : "Defending"}</p>
                <CharacterCard character={1}></CharacterCard>
                <WeaponCard></WeaponCard>
            </div>
        </div>
    )
};
