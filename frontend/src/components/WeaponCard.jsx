import React from "react";
import styles from "./WeaponCard.module.css";
import weapons from "../utils/weapons.json"

export default function WeaponCard({weapon}) {
    const img = require(`../images/weapons/${weapon}.jpg`);
    const weaponData = weapons[weapon];

    return (
        <div className={styles.weapon_card_container}>
            <div className={styles.weapon_card_container__content}>
                <div className={styles.weapon_card_container__content__container}>
                    <img className={styles.weapon_card_container__content__image} src={img} alt={"aa"} />
                </div>
                <div className={styles.weapon_card_container__content__name_container}>
                    <div className={styles.weapon_card_container__content__name}>{weaponData.name.split(" ")[1]||weaponData.name.split(" ")[0]}</div>
                </div>
            </div>
        </div>
    );
    
};
