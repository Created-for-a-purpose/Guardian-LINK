import styles from './Navbar.module.css'
import logo from '../images/logo.svg'
import { useState } from 'react';
import { Typography, Button, Heading, Profile, lightTheme, darkTheme } from '@ensdomains/thorin';
import { DotGridSVG, EthSVG, PersonSVG, HouseSVG, MagnifyingGlassActiveSVG, MoonSVG } from '@ensdomains/thorin';

function Navbar({ theme, setTheme }) { 
  return (
    <>
    <div className={styles.header}>
        <img src={logo} alt="logo" className={styles.logo}/>
        <Heading color='indigo' className={styles.title}>
            Guardian-LINK</Heading>
        <Profile ensName='0x123...456'
         dropdownItems={[
             { label: 'Dashboard', onClick: () => null, icon: <DotGridSVG /> },
             { label: theme===lightTheme?'Dark Mode':'Light Mode', onClick: () => theme===lightTheme?setTheme(darkTheme):setTheme(lightTheme), icon: <MoonSVG />}
             ]}/>
    </div>
    <div className={styles.container}>
    <nav className={styles.navbar}>
        <a className={styles.navbarcontent} href="/home">
            <Typography color='purple' font='large'> <PersonSVG/> Profile</Typography>
        </a>
        <a className={styles.navbarcontent} href="/">
            <Typography color='purple' font='large'><HouseSVG/> Home</Typography>
        </a>
        <a className={styles.navbarcontent} href="/">
            <Typography color='purple' font='large'><MagnifyingGlassActiveSVG/> Search</Typography>
        </a>
    </nav>
        <Button width='44' prefix={<EthSVG/>}> Connect Wallet </Button>
    </div>
    </>
  );
}

export default Navbar;