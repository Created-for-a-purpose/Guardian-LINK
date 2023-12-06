import React from "react";
import styles from "./CharacterCard.module.css";
import characters from "../utils/characters.json"

export default function CharacterCard({ character, onClick }) {
    const img = require(`../images/characters/${character}.jpg`);
    const characterData = characters[character];

    return (
        <div className={styles.character_card_container}>
            <div className={styles.character_card_container__content}>
                <div className={styles.character_card_container__content__container}>
                    <img className={styles.character_card_container__content__image} src={img} alt={"aa"} />
                </div>
                <div className={styles.character_card_container__content__name_container}>
                    <div className={styles.character_card_container__content__name}>{characterData.name}</div>
                </div>
            </div>
        </div>
    );
}