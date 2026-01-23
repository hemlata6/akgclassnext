import { useState, useEffect } from 'react';
import { Header, StickyMobileFooter } from '../components/Header/Header';

export default function Layout({ children }) {
  const [cartCount, setCartCount] = useState(0);

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
    <div className="font-sans text-slate-900 bg-white min-h-screen selection:bg-emerald-200 selection:text-emerald-900">
      <Header cartCount={cartCount} />
      {children}
      <StickyMobileFooter cartCount={cartCount} />
    </div>
  );
}

