import { ThemeProvider } from 'styled-components'
import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'
import Home from './pages/Home'
import { useState } from 'react';

function App() {
  const [theme, setTheme] = useState(lightTheme)

  return (
   <ThemeProvider theme={theme}>
      <ThorinGlobalStyles />
      <Home theme={theme} setTheme={setTheme}/>
    </ThemeProvider>
  );
}

export default App;
