import Navbar from '../components/Navbar'
import styles from './Home.module.css'
import { Card, Tag, Profile, Typography } from '@ensdomains/thorin';
import { CheckCircleSVG, HeartActiveSVG, EnvelopeSVG, AeroplaneSVG, RightArrowSVG } from '@ensdomains/thorin';

function Home({ theme, setTheme }) {
    return (
        <>
            <Navbar theme={theme} setTheme={setTheme} />
            <div className={styles.home}>
                <Card className={styles.post}>
                    <div className={styles.postHeader}>
                    <Profile ensName='vitalik.eth' avatar='https://pbs.twimg.com/profile_images/977496875887558661/L86xyLF4_400x400.jpg'
                    dropdownItems={[
                        {label: 'Go to Profile', onClick: () => alert('Go to Profile'), icon: <RightArrowSVG/>},
                    ]}/>
                    <Tag colorStyle="blueGradient"><CheckCircleSVG/>&nbsp;&nbsp;Verified</Tag>
                    </div>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                    <Typography style={{marginBottom: '1rem'}}> 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                    <Card.Divider/>
                    <div className={styles.postHeader}>
                    <HeartActiveSVG/>
                    <EnvelopeSVG/>
                    <AeroplaneSVG/>
                    </div>
                </Card>

                <Card className={styles.post}>
                    <Profile ensName='satoshi.eth' avatar='https://pbs.twimg.com/profile_images/1706096959369486336/AnSeY7-E_400x400.jpg'/>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                    <Typography style={{marginBottom: '1rem'}}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                    <Card.Divider/>
                    <div className={styles.postHeader}>
                    <HeartActiveSVG/>
                    <EnvelopeSVG/>
                    <AeroplaneSVG/>
                    </div>
                </Card>
            </div>
        </>
    );
}

export default Home;