import Navbar from "../components/Navbar";
import FhePay from "../components/FhePay";
import { Card, Typography, Heading, Avatar, Button } from "@ensdomains/thorin";
import { CopySVG, HeartActiveSVG, LinkSVG } from "@ensdomains/thorin";
import "./Profile.css"

function Profile() {
    const imgUrl = 'https://images.mirror-media.xyz/publication-images/H-zIoEYWk4SpFkljJiwB9.png'
    return (
        <>
            <Navbar />
            <div className="profile_container">
                <div className="profile_header">
                    <div style={{
                        margin: '1rem',
                        width: '100px'
                    }}>
                        <Avatar label="Noun 97" src={imgUrl} />
                    </div>
                    <div>
                        <div className="profile_details">
                            <Typography fontVariant="extraLargeBold">friend.eth&nbsp;</Typography>
                            <CopySVG />
                        </div>
                        <Typography style={{marginLeft: '1rem', marginTop:'0.5rem'}} fontVariant="extraSmall">
                           <LinkSVG/> Links: 1k
                        </Typography>
                    </div>
                    <div className="profile_buttons">
                        <Button prefix={<LinkSVG />} width="28" colorStyle="purpleGradient">
                            Link
                        </Button>
                        <FhePay ens={'friend.eth'} />
                    </div>
                </div>
                <Typography fontVariant="extraLargeBold" style={{marginLeft: '2rem', marginTop: '2rem'}}>Latest content</Typography>
                <Card className="profile_post">
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti quaerat eveniet odit, officiis a laborum magni? Voluptatibus similique mollitia, necessitatibus, aliquid quas nulla officiis, pariatur deleniti consectetur debitis vero iure?
                    </Typography>
                    <Typography fontVariant="extraSmall">today</Typography>
                    <div className="post_footer">
                        <HeartActiveSVG />
                        <Typography fontVariant="extraSmall">12</Typography>
                    </div>
                </Card>
                <Card className="profile_post">
                    <Typography>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti quaerat eveniet odit, officiis a laborum magni? Voluptatibus similique mollitia, necessitatibus, aliquid quas nulla officiis, pariatur deleniti consectetur debitis vero iure?
                    </Typography>
                    <Typography fontVariant="extraSmall">today</Typography>
                    <div className="post_footer">
                        <HeartActiveSVG />
                        <Typography fontVariant="extraSmall">12</Typography>
                    </div>
                </Card>
            </div>
        </>
    );
}

export default Profile;