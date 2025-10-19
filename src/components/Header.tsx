import React, { useEffect, useState } from 'react';
import { ShoppingCart, Instagram, Phone } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase, SiteSettings } from '../lib/supabase';

interface HeaderProps {
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const { getTotalItems } = useCart();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .maybeSingle();
    if (data) setSettings(data);
  };

  return (
    <header className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            {settings?.logo_url && (
              <img
                src={settings.logo_url}
                alt="Gê Bolos Gourmet"
                className="h-14 w-14 md:h-16 md:w-16 object-cover rounded-full shadow-lg border-2 border-amber-200"
              />
            )}
            <h1 className="text-xl md:text-3xl font-script text-amber-900" style={{ fontFamily: "'Great Vibes', cursive" }}>
              Gê Bolos Gourmet
            </h1>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 hover:text-rose-600 transition-colors"
                title="Instagram"
              >
                <Instagram className="w-6 h-6 md:w-7 md:h-7" />
              </a>
            )}

            {settings?.contact_phone && (
              <a
                href={`https://wa.me/${settings.contact_phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-800 hover:text-rose-600 transition-colors"
                title="WhatsApp"
              >
                <Phone className="w-6 h-6 md:w-7 md:h-7" />
              </a>
            )}

            <button
              onClick={onCartClick}
              className="relative text-amber-800 hover:text-rose-600 transition-colors"
              title="Carrinho"
            >
              <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
