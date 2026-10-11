import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/footer/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { Toaster } from 'sonner';
import { useTheme } from '../context/ThemeContext';

export const MainLayout = () => {
  const { settings } = useTheme();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen w-full max-w-full flex flex-col overflow-x-clip transition-colors duration-200"
      style={{
        backgroundColor: 'var(--brand-bg)',
        color: 'var(--brand-text)'
      }}
    >
      <Toaster position="bottom-right" richColors />
      <Navbar settings={settings} />
      <main className="flex-1 w-full max-w-full">
        <Outlet />
      </main>
      <CartDrawer />
      <Footer settings={settings} />
    </div>
  );
};
