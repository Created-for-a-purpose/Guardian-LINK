import "./Dashboard.css";
import Navbar from "../components/Navbar";
import { Card, Banner, Avatar, Typography, Helper, Heading, Button, LinkSVG, EyeStrikethroughSVG, CameraSVG, Input, FilterSVG, Slider, HorizontalOutwardArrowsSVG, EyeSVG, DownArrowSVG } from "@ensdomains/thorin";
import { PersonSVG, QuestionCircleSVG, KeySVG, LockSVG, CheckSVG, Dialog } from "@ensdomains/thorin";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { signMessage } from "@wagmi/core";
import lighthouse from '@lighthouse-web3/sdk'
import { dbUser } from "../utils/polybase"
import gx from "../images/guardian.png"

function Dashboard() {
  const [state, setState] = useState("about");
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generateLoading, setGenerateLoading] = useState('not-loading');
  const getGenerateLoading = _state => _state === generateLoading;
  const [dialogState, setDialogState] = useState('no-dialog');
  const getDialogState = _state => _state === dialogState;
  const [verified, setVerified] = useState(false);
  const LIGHTHOUSE_API_KEY = '8b8298ac.940174d0ee014e158ff730056ce793cc'
  const account = useAccount();

  useEffect(() => {
    const check = async () => {
      const user = await dbUser.record(account.address).get()
      if (user.data) {
        setHasGenerated(true)
      }
    }
    check()
  }, [hasGenerated]);

  const generate = async () => {
    setGenerateLoading('loading');

    const response = await fetch('http://localhost:8000/generateKeyPair');
    if (!response.ok) {
      setGenerateLoading('not-loading');
      return;
    }
    const data = await response.json();
    const secret_payload = JSON.stringify({ sk: data.sk });
    const public_payload = JSON.stringify({ pk: data.pk });
    const auth_message = await fetch(`https://encryption.lighthouse.storage/api/message/${account.address}`)
    const auth_response = await auth_message.json()
    const message = auth_response[0].message

    const signedMessage = await signMessage({ message });

    const lighthouseResponse = await lighthouse.textUploadEncrypted(
      secret_payload,
      LIGHTHOUSE_API_KEY,
      account.address,
      signedMessage,
    );
    // cid of encrypted secret key
    console.log(lighthouseResponse);
    await dbUser.create([account.address, public_payload, lighthouseResponse])
    setGenerateLoading('not-loading');
  }

  const generateProof = async () => {
    setGenerateLoading('loading');
    try {
      const response = await fetch('http://localhost:8001/notarize');
      if (!response.ok) {
        setGenerateLoading('not-loading');
        return;
      }
      else {
        setVerified(true)
      }
    }
    catch (err) {
      console.log(err)
    }
    setGenerateLoading('not-loading');
  }

  const requestSD = async () => {
    setDialogState('dialog')
  }

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <Card className="dashboard_card" style={{ background: 'linear-gradient(to right, rgb(200, 203, 255), rgb(255, 237, 255))' }}>
          <Banner title="About" onClick={() => setState("about")} />
          <Banner title="Get DNS" onClick={() => setState("dns")} />
          <Banner title="Avatar NFT" onClick={() => setState("nft")} />
          <Banner title="Swap" onClick={() => setState("swap")} />
        </Card>

        {state === "about" && <>
          <Card className="dashboard_content" style={{ background: 'linear-gradient(to right, rgb(200, 203, 255), rgb(255, 237, 255))' }}>
            <Helper alignment="vertical" style={{ marginTop: '0.2rem' }}>This is an important step to enable private transactions.</Helper>
            <Heading level="2" color="purple" className="about_heading"><KeySVG style={{ color: "yellow" }} /> Generate your payment keys</Heading>
            <Banner icon={<LockSVG />} iconType="filledCircle" title="This is a one-time step" style={{ backgroundColor: "rgb(230, 242, 254)" }}>
              All keys generated are non-custodial.</Banner>
            {!hasGenerated ? (<Button width="45" colorStyle="purpleGradient" className="about_button" onClick={generate}
              disabled={getGenerateLoading('loading')} loading={getGenerateLoading('loading')}>Generate</Button>) : (
              <Banner icon={<CheckSVG style={{ color: 'green' }} />} title="Great! You have generated your keys" style={{ backgroundColor: "rgb(230, 242, 254)" }}>
                <p>You can now use your keys to make private transactions.</p>
              </Banner>
            )}
          </Card>
        </>}

        {state === "dns" && <>
          <Card className="dashboard_content" style={{ background: 'linear-gradient(to right, rgb(200, 203, 255), rgb(255, 237, 255))' }}>
            <div className="dashboard_content_header">
              {/* <div style={{ width: '100px' }}> */}
              {/* <Avatar label="Noun 97" src={'invalid'} /> */}
              {/* </div> */}
              {/* <Typography fontVariant="extraLarge" style={{ marginTop: '2rem', margin: '2rem' }}>
                <PersonSVG /> &nbsp;Your DNS: &nbsp;<QuestionCircleSVG /></Typography> */}
              <Banner icon={<LinkSVG style={{ color: 'purple' }} />}
                title="Obtain an exclusive multichain DNS now!" style={{ backgroundColor: 'rgb(230, 242, 254)' }}>
                <Typography>
                  Proof of social media presence is required.
                </Typography>
              </Banner>
            </div>
            {!verified && <div className="dashboard_content_body">
              <div style={{ display: 'flex', gap: '1rem' }}>
                <img src={gx} style={{ width: '40px', height: '40px' }} />
                <Heading level="2" color="indigo">
                  Use Guardian-X to prove your presence on X
                </Heading>
              </div>
              <div className="content_card">
                <Card style={{ backgroundColor: 'rgb(230, 242, 254)', textAlign: 'center' }}>
                  <Typography fontVariant="large" style={{ marginBottom: '0.9rem' }}>
                    <EyeStrikethroughSVG />&nbsp;&nbsp;Don't worry! Guardian-LINK cannot see your data.
                  </Typography>
                  <Button prefix={<LockSVG style={{ color: 'yellow' }} />} onClick={generateProof} colorStyle="purpleGradient"
                    disabled={getGenerateLoading('loading')} loading={getGenerateLoading('loading')}>
                    Generate Proof
                  </Button>
                </Card>
              </div>
            </div>}
            {verified && <div className="dashboard_content_body">
              <Card style={{ backgroundColor: 'rgb(230, 242, 254)', marginTop: '1.3rem' }}>
                <Heading color="indigo">
                  <CheckSVG style={{ color: 'green' }} />
                  &nbsp;&nbsp;Verified! You have an account on X.
                </Heading>
                <Button prefix={<LinkSVG />} onClick={() => null}
                  colorStyle="purpleGradient" width="39" style={{ marginTop: '2rem' }}> Get DNS</Button>
              </Card>
            </div>}
            <Helper alignment="horizontal">DNS helps your friends identify you easily!</Helper>
            {/* <Banner iconType="normal" title="Don't forget to mint your Avatar NFT!"
              style={{ width: '38%', height: '15%', marginLeft: '30%', marginTop: '2rem', textAlign: 'center' }} /> */}
          </Card>
        </>}

        {state === "nft" && <>
          <Card className="dashboard_content" style={{ background: 'linear-gradient(to right, rgb(200, 203, 255), rgb(255, 237, 255))' }}>
            <Heading color="indigo" style={{ marginLeft: '1rem', marginTop: '0.2rem' }}>🏞️ AI avatar generator</Heading>
            <Typography fontVariant="small" style={{ color: 'purple', marginLeft: '4rem' }}><CameraSVG /> Powered by Stable Diffusion API</Typography>
            <Input label={<Typography color="indigo" style={{ marginTop: '1rem' }}>Prompt</Typography>}
              placeholder="How should your avatar look?" prefix={<PersonSVG style={{ color: 'purple' }} />} />
            <Typography style={{ marginTop: '1.5rem', marginLeft: '0.5rem', marginBottom: '0.5rem' }} color="indigo">
              <FilterSVG /> Filter
            </Typography>
            <Slider label={<Typography color="purple">Artistic</Typography>} labelSecondary={<Typography color="purple">Realistic</Typography>}></Slider>
            <Button colorStyle="purpleGradient" width="44" style={{ marginLeft: '40%', marginTop: '4rem' }}
              onClick={requestSD}
              suffix={<HorizontalOutwardArrowsSVG />}>Request
            </Button>
          </Card>
          <Dialog open={getDialogState('dialog')}
            onDismiss={() => setDialogState('no-dialog')
            }>
              <Heading color="purple">Select any one <DownArrowSVG/></Heading>
            <div style={{ display: 'flex', marginTop: '1rem' }}>
              <img src={gx} className="nft_image"/>
              <img src={gx} className="nft_image"/>
            </div>
          </Dialog>
        </>}
      </div>
    </>
  )
}

export default Dashboard;