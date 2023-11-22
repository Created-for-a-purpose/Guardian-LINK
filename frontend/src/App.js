import { ThemeProvider } from 'styled-components'
import { ThorinGlobalStyles, lightTheme } from '@ensdomains/thorin'
import Home from './pages/Home'

function App() {
  return (
   <ThemeProvider theme={lightTheme}>
      <ThorinGlobalStyles />
      <Home />
    </ThemeProvider>
  );
}

export default App;
