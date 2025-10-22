import React, { useState, useEffect } from 'react';
import { X, Settings, Package, ShoppingBag, BarChart } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { supabase, SiteSettings } from '../lib/supabase';
import { OrderManagement } from './OrderManagement';
import { ProductManagement } from './ProductManagement';
import { Analytics } from './Analytics';

export const AdminPanel: React.FC = () => {
  const { logout } = useAdmin();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'analytics' | 'settings'>('orders');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').maybeSingle();
    if (data) setSettings(data);
  };

  const handleUpdateSettings = async () => {
    if (!settings) return;
    const { error } = await supabase.from('site_settings').update({
      logo_url: settings.logo_url,
      instagram_url: settings.instagram_url,
      contact_phone: settings.contact_phone,
      pix_key: settings.pix_key,
      pix_qr_code_url: settings.pix_qr_code_url,
      updated_at: new Date().toISOString()
    }).eq('id', settings.id);

    if (!error) {
      alert('Configurações atualizadas com sucesso!');
    } else {
      alert('Erro ao atualizar configurações.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-7xl mx-auto my-8">
          <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-6 flex items-center justify-between border-b-4 border-rose-300 rounded-t-2xl">
            <h2 className="text-3xl font-serif text-amber-900">Painel Administrativo</h2>
            <button
              onClick={logout}
              className="text-amber-900 hover:text-rose-600 transition-colors"
              title="Fechar"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex border-b-2 border-amber-200">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 font-semibold flex items-center justify-center space-x-2 transition-all ${
                activeTab === 'orders'
                  ? 'bg-rose-100 text-rose-700 border-b-4 border-rose-500'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Pedidos</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-4 font-semibold flex items-center justify-center space-x-2 transition-all ${
                activeTab === 'products'
                  ? 'bg-rose-100 text-rose-700 border-b-4 border-rose-500'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Produtos</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-4 font-semibold flex items-center justify-center space-x-2 transition-all ${
                activeTab === 'analytics'
                  ? 'bg-rose-100 text-rose-700 border-b-4 border-rose-500'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <BarChart className="w-5 h-5" />
              <span>Análises</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 font-semibold flex items-center justify-center space-x-2 transition-all ${
                activeTab === 'settings'
                  ? 'bg-rose-100 text-rose-700 border-b-4 border-rose-500'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </button>
          </div>

          <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
            {activeTab === 'orders' && <OrderManagement />}
            {activeTab === 'products' && <ProductManagement />}
            {activeTab === 'analytics' && <Analytics />}

            {activeTab === 'settings' && settings && (
              <div className="space-y-6">
                <h3 className="text-2xl font-serif text-amber-900">Configurações do Site</h3>
                <div className="bg-gradient-to-br from-amber-50 to-rose-50 border-2 border-amber-300 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-2">
                      URL do Logo
                    </label>
                    <input
                      type="text"
                      value={settings.logo_url}
                      onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:border-rose-400 focus:outline-none"
                      placeholder="https://exemplo.com/logo.png"
                    />
                    {settings.logo_url && (
                      <img
                        src={settings.logo_url}
                        alt="Logo Preview"
                        className="mt-2 h-16 w-16 object-cover rounded-full border-2 border-amber-300"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-2">
                      URL do Instagram
                    </label>
                    <input
                      type="text"
                      value={settings.instagram_url}
                      onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:border-rose-400 focus:outline-none"
                      placeholder="https://instagram.com/seu_perfil"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-2">
                      Telefone de Contato (WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={settings.contact_phone}
                      onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:border-rose-400 focus:outline-none"
                      placeholder="5511999999999"
                    />
                    <p className="text-xs text-amber-600 mt-1">
                      Formato: código do país + DDD + número (ex: 5511999999999)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-2">
                      Chave PIX
                    </label>
                    <input
                      type="text"
                      value={settings.pix_key}
                      onChange={(e) => setSettings({ ...settings, pix_key: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:border-rose-400 focus:outline-none"
                      placeholder="seu@email.com ou CPF/CNPJ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-amber-900 mb-2">
                      URL do QR Code PIX
                    </label>
                    <input
                      type="text"
                      value={settings.pix_qr_code_url}
                      onChange={(e) => setSettings({ ...settings, pix_qr_code_url: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:border-rose-400 focus:outline-none"
                      placeholder="https://exemplo.com/qrcode.png"
                    />
                    {settings.pix_qr_code_url && (
                      <img
                        src={settings.pix_qr_code_url}
                        alt="QR Code Preview"
                        className="mt-2 h-32 w-32 object-contain border-2 border-amber-300 rounded-lg"
                      />
                    )}
                  </div>

                  <button
                    onClick={handleUpdateSettings}
                    className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-amber-600 transition-all shadow-md"
                  >
                    Salvar Configurações
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
