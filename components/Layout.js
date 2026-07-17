import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Header, StickyMobileFooter } from '../components/Header/Header';
import AnnouncementsHeader from './Header/AnnouncementsHeader';

export default function Layout({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [shouldHideControls, setShouldHideControls] = useState(false);
  const [isStorePage, setIsStorePage] = useState(false);
  const [isDetailPage, setIsDetailPage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load initial cart count
    updateCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  // Detect query parameters to hide Header and StickyMobileFooter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isMobileParam = params.get('isMobile');
      const tokenParam = params.get('token');
      
      setShouldHideControls(!!(isMobileParam || tokenParam));
      setIsStorePage(router.pathname === '/store');
      setIsDetailPage(router.pathname.startsWith('/course/') || router.pathname.startsWith('/book/') || router.pathname.startsWith('/faculty/'));
    }
  }, [router.pathname, router.asPath]);

  const updateCartCount = () => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartCourses');
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          setCartCount(Array.isArray(cart) ? cart.length : 0);
        } catch (error) {
          console.error('Error parsing cart:', error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    }
  };

  return (
    <div className="text-slate-900 bg-[#F4F6F9] min-h-screen selection:bg-indigo-200 selection:text-indigo-900 overflow-x-hidden" style={{fontFamily: "'Inter', system-ui, sans-serif"}}>
      {!shouldHideControls && !isStorePage && <Header cartCount={cartCount} />}
      {!shouldHideControls && !isStorePage && !isDetailPage && <AnnouncementsHeader cartCount={cartCount} />}
      {children}
      {!shouldHideControls && <StickyMobileFooter cartCount={cartCount} />}
    </div>
  );
}

