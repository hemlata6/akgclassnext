import '../styles/globals.css';
import { AuthProvider } from '../config/AuthContext';
import { StudentProvider } from '../config/StudentContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Scroll to top on route change
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <AuthProvider>
      <StudentProvider>
        <Component {...pageProps} />
      </StudentProvider>
    </AuthProvider>
  );
}

export default MyApp;

