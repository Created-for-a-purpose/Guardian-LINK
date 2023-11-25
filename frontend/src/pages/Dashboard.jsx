import "./Dashboard.css";
import Navbar from "../components/Navbar";
import { Card, Banner, Avatar, Typography, Helper, Heading, LockSVG, Button } from "@ensdomains/thorin";
import { PersonSVG, QuestionCircleSVG, KeySVG } from "@ensdomains/thorin";
import { useState } from "react";

function Dashboard() {
  const [state, setState] = useState("about");
  const [generateLoading, setGenerateLoading] = useState('not-loading');
  const getGenerateLoading = _state => _state === generateLoading;

  const generate = () => {
    setGenerateLoading('loading');
    
    


    setGenerateLoading('not-loading');
  }

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <Card className="dashboard_card" style={{background: 'linear-gradient(to right, rgb(200, 203, 255), rgb(255, 237, 255))'}}>
          <Banner title="About" onClick={()=>setState("about")}/>
          <Banner title="Get DNS" onClick={()=>setState("dns")}/>
          <Banner title="Avatar NFT" onClick={()=>setState("nft")}/>
          <Banner title="Swap" onClick={()=>setState("swap")}/>
        </Card>

        { state==="about" && <>
        <Card className="dashboard_content" style={{background: 'linear-gradient(to right, rgb(200, 203, 255), rgb(255, 237, 255))'}}>
        <Helper alignment="vertical" style={{marginTop: '0.2rem'}}>This is an important step to enable private transactions.</Helper>
        <Heading level="2" color="purple" className="about_heading"><KeySVG style={{color: "yellow"}}/> Generate your payment keys</Heading>
        <Banner icon={<LockSVG/>} iconType="filledCircle" title="This is a one-time step" style={{backgroundColor: "rgb(230, 242, 254)"}}>
          All keys generated are non-custodial.</Banner>
        <Button width="45" colorStyle="purpleGradient" className="about_button" onClick={generate}
        disabled={getGenerateLoading('loading')} loading={getGenerateLoading('loading')}>Generate</Button>
        </Card>
        </>}

        { state==="dns" && <>
        <Card className="dashboard_content" style={{background: 'linear-gradient(to right, rgb(200, 203, 255), rgb(255, 237, 255))'}}>
            <Helper alignment="horizontal">DNS helps your friends identify you easily!</Helper>
          <div className="dashboard_content_header">
            <div style={{ width: '100px' }}>
              <Avatar label="Noun 97" src={'invalid'} />
            </div>
            <Typography fontVariant="extraLarge" style={{marginTop:'2rem', margin: '2rem'}}>
              <PersonSVG/> &nbsp;Your DNS: &nbsp;<QuestionCircleSVG/></Typography>
          </div>
          <Banner iconType="normal" title="Don't forget to mint your Avatar NFT!" 
          style={{width: '38%',height:'20%', marginLeft: '30%', marginTop: '2rem', textAlign: 'center'}}/>
        </Card>
        </>}

      </div>
    </>
  )
}

export default Dashboard;