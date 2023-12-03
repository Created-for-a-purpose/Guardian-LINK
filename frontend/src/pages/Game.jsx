import React from "react";
import styles from "./Game.module.css";
import { useNavigate } from "react-router-dom";

export default function Game() {
    const navigate = useNavigate();
    return (
        <div className={styles.game_container}>
            <div className={styles.game_container__buttons}>
                <button className={styles.game_container__buttons__button} onClick={() => {navigate("./play")}}>Play</button>
                <button className={styles.game_container__buttons__button}>Go Back</button>
            </div>
        </div>
    );
};
