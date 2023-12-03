import React from "react";
import styles from "./WeaponCard.module.css";



export default function WeaponCard({weapon}) {
    const img = require(`../images/weapons/${5}.jpg`);

    return (
        <div className={styles.weapon_card_container}>
            <div className={styles.weapon_card_container__content}>
                <div className={styles.weapon_card_container__content__container}>
                    <img className={styles.weapon_card_container__content__image} src={img} alt={"aa"} />
                </div>
                <div className={styles.weapon_card_container__content__name_container}>
                    <div className={styles.weapon_card_container__content__name}>{"Sword"}</div>
                </div>
            </div>
        </div>
    );
    
};
