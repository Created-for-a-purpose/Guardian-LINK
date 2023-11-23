import Navbar from "../components/Navbar";
import { Card, Banner, Avatar, Typography, Helper } from "@ensdomains/thorin";
import { PersonSVG, QuestionCircleSVG } from "@ensdomains/thorin";
import "./Dashboard.css";

function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="dashboard">
        <Card className="dashboard_card" style={{background: 'linear-gradient(to right, rgb(200, 203, 255), rgb(255, 237, 255))'}}>
          <Banner title="About" onClick={()=>null}/>
          <Banner title="Get DNS" onClick={()=>null}/>
          <Banner title="Avatar NFT" onClick={()=>null}/>
          <Banner title="..." onClick={()=>null}/>
        </Card>
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
          style={{width: '38%', marginLeft: '30%', marginTop: '2rem', textAlign: 'center'}}/>
        </Card>
      </div>
    </>
  )
}

export default Dashboard;