import React, { useState, useEffect } from "react";
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
    const [ choices, setChoices ] = useState([])
    const provider = new ethers.BrowserProvider(window.ethereum)
    let randomness = '945678654567898767'

    useEffect(() => {
        const retrieveRandomness = async () => {
            // const contract = new ethers.Contract(guardianWars, guardianWarsAbi, await provider.getSigner())
            // randomness = await contract.getRandomness();
        }
        retrieveRandomness()
    }, [])

    const toggle = (e) => {
        if (attackCooldownManager[e.target.value] === 'Recharging...') return false
        let array = [...attackCooldownManager]
        array[e.target.value] = 'Recharging...'
        setAttackCooldownManager(array)
        setTimeout(() => {
            array = [...attackCooldownManager]
            array[e.target.value] = attacks[e.target.value]
            setAttackCooldownManager(array)
        }, [attackCooldown[e.target.value] * 1000])
        return true
    }

    const mapper = (weight) =>{
       weight = parseInt(weight)
       if(weight==9) return {hit: 'Ruthless!!', damage: `+${weight} damage`}
       else if(weight<=8 && weight>=7) return {hit: 'Devastating!', damage: `+${weight} damage`}
       else if(weight<=6 && weight>=5) return {hit: 'Deadly!', damage: `+${weight} damage`}
       else if(weight<=4 && weight>=2) return {hit: 'Weak', damage: `+${weight} damage`}
       return {hit: 'Ineffective', damage: `+${weight} damage`}
    }

    const attacked = (e) => {
        if(!toggle(e)) return
        return
        setChoices([...choices, attackCooldown[e.target.value]])
        const mod = 10**(choices.length+1)
        const weight = ((attackCooldown[e.target.value]*(randomness%mod))%mod)/(10**choices.length)
        const effect = mapper(weight);
        setHit(effect.hit)
        setDamage(effect.damage)
        setTimeout(()=>{
            setHit('')
            setDamage('')
        }, [2000])
        console.log(choices)
    }

    return (
        <div className={styles.container}>
            <div className={styles.player_container}>
                <p className={styles.turn}>Attacking!</p>
                <CharacterCard character={1}></CharacterCard>
                <WeaponCard weapon={1}></WeaponCard>
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
                <CharacterCard character={1}></CharacterCard>
                <WeaponCard weapon={1}></WeaponCard>
            </div>
        </div>
    )
};
