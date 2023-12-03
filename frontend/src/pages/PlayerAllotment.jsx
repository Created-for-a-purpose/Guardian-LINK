import React from "react";
import styles from "./PlayerAllotment.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CharacterCard from "../components/CharacterCard";
import WeaponCard from "../components/WeaponCard";


export default function PlayerAllotment() {
    const [players, setPlayers] = useState(Math.floor(Math.random() * 100) % 8);
    const [weapons, setWeapons] = useState(Math.floor(Math.random() * 100) % 9);
    return (
        <div className={styles.player_allotment_container}>
            <h1>Guardian Wars</h1>
            <div className={styles.player_allotment_container__content}>
                <div className={styles.player_allotment_container__content__player}>
                    <CharacterCard character={players}></CharacterCard>
                </div>
                <div className={styles.player_allotment_container__content__body}>
                    <div className={styles.player_allotment_container__content__body__description}>
                        Golem Snickermack: A grinning goblin turned undead, wielding scavenged contraptions. Choose for an eerie twist in your fantasy quest.
                    </div>
                    <div className={styles.player_allotment_container__content__body__weapon_container}>
                        <WeaponCard weapon={weapons}></WeaponCard>
                        <div className={styles.player_allotment_container__content__body__weapon_description}>
                            <p>
                                Golem Snickermack: A grinning goblin turned undead, wielding scavenged contraptions. Choose for an eerie twist in your fantasy quest.
                            </p>
                            <p>
                                Special Attack: Burn
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
                            <button className={styles.button_container__button}>Start</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
