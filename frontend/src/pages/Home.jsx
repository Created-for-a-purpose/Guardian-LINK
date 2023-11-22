import Navbar from '../components/Navbar'
import styles from './Home.module.css'
import { Card, Tag, Profile, Typography } from '@ensdomains/thorin';
import { CheckCircleSVG } from '@ensdomains/thorin';

function Home() {
    return (
        <>
            <Navbar />
            <div className={styles.home}>
                <Card className={styles.post}>
                    <div className={styles.postHeader}>
                    <Profile ensName='vitalik.eth' avatar='https://pbs.twimg.com/profile_images/977496875887558661/L86xyLF4_400x400.jpg'/>
                    <Tag colorStyle="bluePrimary"><CheckCircleSVG/>&nbsp;&nbsp;Verified</Tag>
                    </div>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                </Card>
                <Card className={styles.post}>
                    <Profile ensName='satoshi.eth' avatar='https://pbs.twimg.com/profile_images/1706096959369486336/AnSeY7-E_400x400.jpg'/>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                    <Card.Divider/>
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </Typography>
                </Card>
            </div>
        </>
    );
}

export default Home;