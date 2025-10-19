import React, { useState } from 'react';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { MenuButton } from './components/MenuButton';
import { CakeShowcase } from './components/CakeShowcase';
import { Footer } from './components/Footer';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { AdminLogin } from './components/AdminLogin';
import { AdminPanel } from './components/AdminPanel';

function AppContent() {
  const { isAdmin, showAdminLogin } = useAdmin();
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onCartClick={() => setShowCart(true)} />
      <main className="flex-1">
        <Banner />
        <MenuButton onClick={() => setShowMenu(true)} />
        <CakeShowcase />
      </main>
      <Footer />

      {showMenu && <Menu onClose={() => setShowMenu(false)} />}
      {showCart && <Cart onClose={() => setShowCart(false)} onCheckout={handleCheckout} />}
      {showCheckout && <Checkout onClose={() => setShowCheckout(false)} onSuccess={handleCheckoutSuccess} />}
      {showAdminLogin && !isAdmin && <AdminLogin />}
      {isAdmin && <AdminPanel />}
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AdminProvider>
  );
}

export default App;
