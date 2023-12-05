import { ThemeProvider } from 'styled-components'
import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import { useState } from 'react';
import { Routes, Route } from "react-router-dom"

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme as lt
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { polygonMumbai, avalancheFuji } from 'wagmi/chains';
import Game from './pages/Game'
import PlayerAllotment from './pages/PlayerAllotment'
import GamePlay from './pages/GamePlay'
const { chains, publicClient } = configureChains(
  [avalancheFuji, polygonMumbai],
  [publicProvider()]
);
const { connectors } = getDefaultWallets({
  appName: 'CB',
  projectId: 'cbabb06b3a049fce0e9231318d94998e',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

function App() {
  const [theme, setTheme] = useState(lightTheme)

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} modalSize="compact" coolMode showRecentTransactions={true}
        theme={lt({
          accentColor: 'rgb(140,70,213)',
          accentColorForeground: 'white',
          borderRadius: 'medium',
          fontStack: 'system',
          overlayBlur: 'small',
        })}>
        <ThemeProvider theme={theme}>
          <ThorinGlobalStyles />
          <Routes>
            <Route path="/" element={<Home theme={theme} setTheme={setTheme} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route exact path="/game" element={<Game />} />
            <Route exact path="/game/play" element={<PlayerAllotment />} />
            <Route exact path="/game/play-level" element={<GamePlay />} />
          </Routes>
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
