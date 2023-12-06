import React, { useState, useEffect, useRef } from "react";
import styles from "./GamePlay.module.css"
import CharacterCard from '../components/CharacterCard';
import WeaponCard from "../components/WeaponCard";
import { guardianWars, guardianWarsAbi } from "../utils/constants";
import { ethers } from 'ethers'

export default function GamePlay() {
    const [hit, setHit] = useState('');
    const [damage, setDamage] = useState('')
    const attackCooldown = [5, 3, 2, 1]
    const attacks = ['Ember', 'Blaze', 'Slash', 'Hit']
    const [attackCooldownManager, setAttackCooldownManager] = useState(attacks)
    const [choices, setChoices] = useState([])
    const [health, setHealth] = useState('10')
    const [armor, setArmor] = useState('10')
    const [attack, setAttack] = useState('⚔️')
    const [durationEnded, setDurationEnded] = useState(false)
    const activeTimeoutsRef = useRef([]);
    const provider = new ethers.BrowserProvider(window.ethereum)
    let randomness = '945678654567898767'
    let [playerData, setPlayerData] = useState([{character: 0, weapon: 2}, {character: 1, weapon: 1}])

    useEffect(() => {
        const retrieveData = async () => {
            const contract = new ethers.Contract(guardianWars, guardianWarsAbi, await provider.getSigner())
            randomness = (await contract.getRandomness()).toString();
            const data = await contract.getCharacters();
            setPlayerData([{character: data[0][0], weapon: data[0][1]}, {character: data[1][0], weapon: data[1][1]}])
        }
        retrieveData()
    }, [])

    useEffect(() => {
        return () => {
            activeTimeoutsRef.current.forEach((id) => clearTimeout(id));
        };
    }, []);

    const toggle = (e) => {
        if (attackCooldownManager[e.target.value] === 'Recharging...') return false
        console.log('Toggle - Start:', e.target.value);

        setAttackCooldownManager((prevCooldownManager) => {
            const newArray = [...prevCooldownManager];
            newArray[e.target.value] = 'Recharging...';
            return newArray;
        });
        const timeoutId = setTimeout(() => {
            console.log('Timeout - start:', e.target.value);
            setAttackCooldownManager((prevCooldownManager) => {
                const newArray = [...prevCooldownManager];
                newArray[e.target.value] = attacks[e.target.value];
                return newArray;
            });
            activeTimeoutsRef.current = activeTimeoutsRef.current.filter((id) => id !== timeoutId);
            console.log('Timeout - End:', e.target.value);
        }, [attackCooldown[e.target.value] * 1000])
        activeTimeoutsRef.current.push(timeoutId);
        console.log('Toggle - Start:', e.target.value);
        return true
    }

    const mapper = (weight) => {
        weight = parseInt(weight)
        setHealth((health-weight/20).toFixed(2))
        if (weight == 9)
        {
            setHealth((health-weight/20).toFixed(2))
            setArmor((armor-weight/100).toFixed(2))
            setAttack(attack==='⚔️'?'🤺':'⚔️')
            return { hit: 'Ruthless!!', damage: `+${weight} damage` }
        }
        else if (weight <= 8 && weight >= 7) {
            setArmor((armor-weight/20).toFixed(2))
            return { hit: 'Devastating!', damage: `+${weight} damage` }
        }
        else if (weight <= 6 && weight >= 5) return { hit: 'Deadly!', damage: `+${weight} damage` }
        else if (weight <= 4 && weight >= 2) return { hit: 'Weak', damage: `+${weight} damage` }
        return { hit: 'Ineffective', damage: `+${weight} damage` }
    }

    const attacked = (e) => {
        if (!toggle(e)) return
        setChoices([...choices, attackCooldown[e.target.value]])

        const mod = 10 ** (choices.length + 1)
        const weight = ((attackCooldown[e.target.value] * (randomness % mod)) % mod) / (10 ** choices.length)
        const effect = mapper(weight);
        setHit(effect.hit)
        setDamage(effect.damage)
        setTimeout(() => {
            setHit('')
            setDamage('')
        }, [2000])
        console.log(choices)
    }

    return (
        <div className={styles.container}>
            <div className={styles.player_container}>
                <p className={styles.turn}>Attacking!</p>
                <CharacterCard character={playerData ? playerData[0].character: 0}></CharacterCard>
                <WeaponCard weapon={playerData ? playerData[0].weapon: 0}></WeaponCard>
            </div>

            <div className={styles.player_attacks}>
                <div className={styles.health}>
                    <div className={styles.health_player1}>
                        <p>
                            {attack}
                        </p>
                    </div>
                    <div className={styles.health_player2}>
                        <p>
                            {health} ❤️
                        </p>
                        <p>
                            10 ⚔️
                        </p>
                        <p>
                            {armor} 🛡️
                        </p>

                    </div>
                </div>
                <div className={styles.move_result}>
                    <p>
                        {hit}
                    </p>
                    <p>
                        {damage}
                    </p>
                </div>
                <div className={styles.player_moves}>
                    <button className={styles.attack_btn} value={0} onClick={attacked}>{attackCooldownManager[0]}</button>
                    <button className={styles.attack_btn} value={1} onClick={attacked}>{attackCooldownManager[1]}</button>
                    <button className={styles.attack_btn} value={2} onClick={attacked}>{attackCooldownManager[2]}</button>
                    <button className={styles.attack_btn} value={3} onClick={attacked}>{attackCooldownManager[3]}</button>
                </div>
            </div>
            <div className={styles.player_container}>
                <p className={styles.turn}>Defending</p>
                <CharacterCard character={playerData ? playerData[1].character: 0}></CharacterCard>
                <WeaponCard weapon={playerData ? playerData[1].weapon: 0}></WeaponCard>
            </div>
            <dialog open={durationEnded} className={styles.dialog_box}>
                {/* <p className={styles.dialog}>Game ended!</p>
                <button className={styles.dialog_btn}>Proceed</button> */}
                {/* <p className={styles.dialog_win}>You won!</p>
                <p className={styles.dialog_win} style={{color: 'red'}}>You lost!</p>
                <p className={styles.dialog_result}>You dealt more damage to your opponent!</p> */}
            </dialog>
        </div>
    )
};
