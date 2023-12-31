import styles from './Navbar.module.css'
import logo from '../images/logo.svg'
import { Typography, Heading, Profile, lightTheme, darkTheme } from '@ensdomains/thorin';
import { DotGridSVG, PersonSVG, HouseSVG, MagnifyingGlassActiveSVG, MoonSVG } from '@ensdomains/thorin';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ccipDnsAbi, ccipDnsFuji, ccipDnsMumbai } from '../utils/constants';
import { readContract } from 'wagmi/actions'

function Navbar({ update, theme, setTheme }) {
    const navigate = useNavigate();
    const account = useAccount();
    const chainId = useChainId();
    const [ ensName, setEnsName ] = useState('');

    useEffect(() => {
        async function getEnsName() {
            let contractAddress ='';
            if (chainId === 43113) {
                contractAddress = ccipDnsFuji;
            } else if (chainId === 80001) {
                contractAddress = ccipDnsMumbai;
            } 

            const did = await readContract({
                abi: ccipDnsAbi,
                address: contractAddress,
                functionName: 'resolver',
                args: [account.address]
            })
            setEnsName(did?.[0]);
            console.log(did);
        }
        if (account) getEnsName();
    }, [update]);

    return (
        <>
            <div className={styles.header}>
                <img src={logo} alt="logo" className={styles.logo} />
                <Heading color='indigo' className={styles.title}>
                    Guardian-LINK</Heading>
                <Profile ensName={account&&account.address?(!ensName?account.address:ensName):'...'}
                    dropdownItems={[
                        { label: 'Dashboard', onClick: () => navigate('/dashboard'), icon: <DotGridSVG /> },
                        { label: theme === lightTheme ? 'Dark Mode' : 'Light Mode', onClick: () => theme === lightTheme ? setTheme(darkTheme) : setTheme(lightTheme), icon: <MoonSVG /> }
                    ]} />
            </div>
            <div className={styles.container}>
                <nav className={styles.navbar}>
                    <a className={styles.navbarcontent} href="/profile">
                        <Typography color='purple' font='large'> <PersonSVG /> Profile</Typography>
                    </a>
                    <a className={styles.navbarcontent} href="/">
                        <Typography color='purple' font='large'><HouseSVG /> Home</Typography>
                    </a>
                    <a className={styles.navbarcontent} href="/search">
                        <Typography color='purple' font='large'><MagnifyingGlassActiveSVG /> Search</Typography>
                    </a>
                </nav>
                <ConnectButton label='Connect Wallet' accountStatus="address" chainStatus='icon'
                    showBalance={false} />
            </div>
        </>
    );
}

export default Navbar;