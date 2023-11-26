import "./Dashboard.css";
import Navbar from "../components/Navbar";
import { Card, Banner, Avatar, Typography, Helper, Heading, Button } from "@ensdomains/thorin";
import { PersonSVG, QuestionCircleSVG, KeySVG, LockSVG, CheckSVG } from "@ensdomains/thorin";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { signMessage } from "@wagmi/core";
import lighthouse from '@lighthouse-web3/sdk'
import { dbUser } from "../utils/polybase"

function Dashboard() {
  const [state, setState] = useState("about");
  const [hasGenerated, setHasGenerated] = useState(false); 
  const [generateLoading, setGenerateLoading] = useState('not-loading');
  const getGenerateLoading = _state => _state === generateLoading;
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
    const secret_payload = JSON.stringify({sk: data.sk});
    const public_payload = JSON.stringify({pk: data.pk});
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
            { !hasGenerated ? (<Button width="45" colorStyle="purpleGradient" className="about_button" onClick={generate}
              disabled={getGenerateLoading('loading')} loading={getGenerateLoading('loading')}>Generate</Button>):(
                <Banner icon={<CheckSVG style={{color: 'green'}}/>} title="Great! You have generated your keys" style={{ backgroundColor: "rgb(230, 242, 254)"}}>
                  <p>You can now use your keys to make private transactions.</p>
                </Banner>
              )}
          </Card>
        </>}

        {state === "dns" && <>
          <Card className="dashboard_content" style={{ background: 'linear-gradient(to right, rgb(200, 203, 255), rgb(255, 237, 255))' }}>
            <Helper alignment="horizontal">DNS helps your friends identify you easily!</Helper>
            <div className="dashboard_content_header">
              <div style={{ width: '100px' }}>
                <Avatar label="Noun 97" src={'invalid'} />
              </div>
              <Typography fontVariant="extraLarge" style={{ marginTop: '2rem', margin: '2rem' }}>
                <PersonSVG /> &nbsp;Your DNS: &nbsp;<QuestionCircleSVG /></Typography>
            </div>
            <Banner iconType="normal" title="Don't forget to mint your Avatar NFT!"
              style={{ width: '38%', height: '20%', marginLeft: '30%', marginTop: '2rem', textAlign: 'center' }} />
          </Card>
        </>}

      </div>
    </>
  )
}

export default Dashboard;