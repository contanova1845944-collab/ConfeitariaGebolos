import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { supabase, SiteSettings } from '../lib/supabase';

interface CheckoutProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onClose, onSuccess }) => {
  const { cart, getTotalAmount, clearCart } = useCart();
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    neighborhood: '',
    number: '',
    complement: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handleConfirmPayment = async () => {
    const { error } = await supabase.from('orders').insert({
      customer_name: formData.name,
      customer_phone: formData.phone,
      address_street: formData.street,
      address_neighborhood: formData.neighborhood,
      address_number: formData.number,
      address_complement: formData.complement,
      items: cart,
      total_amount: getTotalAmount(),
      status: 'pending',
    });

    if (!error) {
      setStep('success');
      setTimeout(() => {
        clearCart();
        onSuccess();
      }, 3000);
    }
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full mx-auto flex items-center justify-center">
              <span className="text-4xl">🎉</span>
            </div>
          </div>
          <h2 className="text-3xl font-serif text-amber-900 mb-4">
            Pedido Confirmado!
          </h2>
          <p className="text-amber-800 leading-relaxed mb-2">
            Obrigada por escolher a Gê Bolos Gourmet!
          </p>
          <p className="text-amber-800 leading-relaxed">
            Seu pedido foi recebido com carinho e logo entraremos em contato para confirmar os detalhes.
          </p>
          <p className="text-rose-600 font-serif mt-4 italic">
            Você será redirecionado em instantes...
          </p>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
          <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-6 flex items-center justify-between border-b-4 border-rose-300">
            <h2 className="text-3xl font-serif text-amber-900">Pagamento via Pix</h2>
            <button onClick={onClose} className="text-amber-900 hover:text-rose-600">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-6 rounded-xl border-2 border-amber-200">
              <h3 className="text-xl font-serif text-amber-900 mb-4 text-center">
                Total do Pedido
              </h3>
              <p className="text-4xl font-bold text-rose-600 text-center">
                R$ {getTotalAmount().toFixed(2)}
              </p>
            </div>

            <div className="text-center space-y-4">
              <p className="text-amber-800 font-semibold">
                Escaneie o QR Code ou use a chave Pix:
              </p>

              {settings?.pix_qr_code_url && (
                <div className="flex justify-center">
                  <img
                    src={settings.pix_qr_code_url}
                    alt="QR Code Pix"
                    className="w-64 h-64 object-contain border-4 border-amber-300 rounded-xl"
                  />
                </div>
              )}

              {settings?.pix_key && (
                <div className="bg-amber-100 p-4 rounded-lg">
                  <p className="text-sm text-amber-700 mb-2">Chave Pix:</p>
                  <p className="text-lg font-mono text-amber-900 font-bold">
                    {settings.pix_key}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirmPayment}
                className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-4 rounded-xl font-serif text-xl hover:from-rose-600 hover:to-amber-600 transition-all shadow-lg"
              >
                Confirmar Pagamento
              </button>
              <button
                onClick={() => setStep('form')}
                className="w-full bg-amber-200 text-amber-900 py-3 rounded-xl font-semibold hover:bg-amber-300 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-6 flex items-center justify-between border-b-4 border-rose-300">
          <h2 className="text-3xl font-serif text-amber-900">Dados de Entrega</h2>
          <button onClick={onClose} className="text-amber-900 hover:text-rose-600">
            <X className="w-8 h-8" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-amber-900 font-semibold mb-2">Nome Completo</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-rose-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-900 font-semibold mb-2">Telefone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-rose-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-900 font-semibold mb-2">Rua</label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-rose-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-900 font-semibold mb-2">Bairro</label>
              <input
                type="text"
                required
                value={formData.neighborhood}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-amber-900 font-semibold mb-2">Número</label>
              <input
                type="text"
                required
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-rose-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-amber-900 font-semibold mb-2">Complemento (Opcional)</label>
            <input
              type="text"
              value={formData.complement}
              onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-rose-400 focus:outline-none"
            />
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-rose-50 p-4 rounded-xl border-2 border-amber-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-serif text-amber-900">Total:</span>
              <span className="text-2xl font-bold text-rose-600">
                R$ {getTotalAmount().toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-4 rounded-xl font-serif text-xl hover:from-rose-600 hover:to-amber-600 transition-all shadow-lg"
          >
            Continuar para Pagamento
          </button>
        </form>
      </div>
    </div>
  );
};
