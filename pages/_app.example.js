import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TestSeriesProvider } from '../context/TestSeriesContext';
import theme from '../styles/theme'; // Your theme file
import '../styles/globals.css';

/**
 * Next.js App Component
 * Wraps all pages with necessary providers
 */
function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Wrap with TestSeriesProvider for test series data management */}
      <TestSeriesProvider>
        <Component {...pageProps} />
      </TestSeriesProvider>
    </ThemeProvider>
  );
}

export default MyApp;
