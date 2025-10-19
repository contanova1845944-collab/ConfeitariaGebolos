import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartProps {
  onClose: () => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ onClose, onCheckout }) => {
  const { cart, updateQuantity, removeFromCart, getTotalAmount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-serif text-amber-900">Carrinho</h2>
            <button onClick={onClose} className="text-amber-900 hover:text-rose-600">
              <X className="w-8 h-8" />
            </button>
          </div>
          <div className="text-center py-12">
            <p className="text-xl text-amber-800 font-serif">
              Seu carrinho está vazio
            </p>
            <p className="text-amber-600 mt-2">
              Adicione alguns bolos deliciosos!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-r from-amber-100 to-rose-100 p-6 flex items-center justify-between border-b-4 border-rose-300">
          <h2 className="text-3xl font-serif text-amber-900">Carrinho</h2>
          <button onClick={onClose} className="text-amber-900 hover:text-rose-600">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center space-x-4 bg-gradient-to-r from-amber-50 to-rose-50 p-4 rounded-xl border-2 border-amber-200"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-serif text-amber-900 text-lg">{item.name}</h3>
                  <p className="text-rose-600 font-bold">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    className="bg-amber-200 hover:bg-amber-300 p-2 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4 text-amber-900" />
                  </button>
                  <span className="w-8 text-center font-bold text-amber-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    className="bg-amber-200 hover:bg-amber-300 p-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4 text-amber-900" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="bg-rose-200 hover:bg-rose-300 p-2 rounded-lg transition-colors ml-2"
                  >
                    <Trash2 className="w-4 h-4 text-rose-900" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-gradient-to-r from-amber-100 to-rose-100 p-6 border-t-4 border-rose-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-serif text-amber-900">Total:</span>
            <span className="text-3xl font-bold text-rose-600">
              R$ {getTotalAmount().toFixed(2)}
            </span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-4 rounded-xl font-serif text-xl hover:from-rose-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};
