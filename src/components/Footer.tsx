import React, { useEffect, useState } from 'react';
import { Instagram, Phone, Heart, Sparkles } from 'lucide-react';
import { supabase, SiteSettings } from '../lib/supabase';

export const Footer: React.FC = () => {
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
    <footer className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-amber-50 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-left space-y-4">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Instagram className="w-6 h-6 text-rose-300" />
              <h3 className="text-xl font-serif text-amber-100">Siga-nos</h3>
            </div>
            <p className="text-amber-200 leading-relaxed">
              Acompanhe nossas criações diárias, promoções especiais e novidades deliciosas no Instagram!
            </p>
            {settings?.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-rose-400 to-amber-400 text-white px-6 py-2 rounded-full font-semibold hover:from-rose-500 hover:to-amber-500 transition-all shadow-lg"
              >
                @gebolosgoumet
              </a>
            )}
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Phone className="w-6 h-6 text-rose-300" />
              <h3 className="text-xl font-serif text-amber-100">Fale Conosco</h3>
            </div>
            <p className="text-amber-200 leading-relaxed">
              Dúvidas sobre sabores, tamanhos ou entregas? Estamos aqui para ajudar!
            </p>
            {settings?.contact_phone && (
              <a
                href={`https://wa.me/${settings.contact_phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-rose-400 to-amber-400 text-white px-6 py-2 rounded-full font-semibold hover:from-rose-500 hover:to-amber-500 transition-all shadow-lg"
              >
                WhatsApp
              </a>
            )}
          </div>

          <div className="text-center md:text-right space-y-4">
            <div className="flex items-center justify-center md:justify-end space-x-2">
              <Sparkles className="w-6 h-6 text-rose-300" />
              <h3 className="text-xl font-serif text-amber-100">Faça seu Pedido</h3>
            </div>
            <p className="text-amber-200 leading-relaxed" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Encomende seu bolo especial e crie momentos inesquecíveis. Você não vai se arrepender!
            </p>
          </div>
        </div>

        <div className="border-t border-amber-700 pt-8 mt-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-amber-200">
              <span style={{ fontFamily: "'Great Vibes', cursive" }} className="text-2xl">
                Gê Bolos Gourmet
              </span>
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
            </div>
            <p className="text-amber-300 text-sm" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Cada bolo é feito com amor, dedicação e os melhores ingredientes
            </p>
            <p className="text-amber-400 text-sm">
              © 2025 Gê Bolos Gourmet - Todos os direitos reservados
            </p>
            <p className="text-amber-300 text-xs italic">
              Obrigada por escolher nossa confeitaria artesanal. Sua satisfação é nossa maior recompensa!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
