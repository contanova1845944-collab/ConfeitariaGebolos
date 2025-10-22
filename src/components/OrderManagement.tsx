import React, { useState, useEffect } from 'react';
import { Check, X, Trash2, RotateCcw, Package, Clock, AlertCircle } from 'lucide-react';
import { supabase, Order } from '../lib/supabase';

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'deleted'>('pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('status', activeTab)
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'accepted' | 'deleted') => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (!error) {
      fetchOrders();
    }
  };

  const deleteOrderPermanently = async (orderId: string) => {
    if (!confirm('Tem certeza que deseja excluir este pedido permanentemente? Esta ação não pode ser desfeita.')) {
      return;
    }

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (!error) {
      fetchOrders();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'accepted':
        return <Package className="w-5 h-5" />;
      case 'deleted':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-amber-200">
        {(['pending', 'accepted', 'deleted'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-all ${
              activeTab === tab
                ? 'border-b-4 border-rose-500 text-rose-600'
                : 'text-amber-700 hover:text-rose-500'
            }`}
          >
            {getTabIcon(tab)}
            <span>
              {tab === 'pending' && 'Pendentes'}
              {tab === 'accepted' && 'Aceitos'}
              {tab === 'deleted' && 'Excluídos'}
            </span>
            <span className="bg-amber-200 text-amber-900 px-2 py-1 rounded-full text-xs">
              {orders.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
          <p className="mt-4 text-amber-700">Carregando pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-amber-700 text-lg">Nenhum pedido {activeTab === 'pending' ? 'pendente' : activeTab === 'accepted' ? 'aceito' : 'excluído'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border-2 border-amber-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-serif text-amber-900">{order.customer_name}</h3>
                  <p className="text-sm text-amber-600">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-rose-600">R$ {order.total_amount.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-sm text-amber-700"><strong>Telefone:</strong> {order.customer_phone}</p>
                  <p className="text-sm text-amber-700"><strong>Endereço:</strong> {order.address_street}, {order.address_number}</p>
                  <p className="text-sm text-amber-700"><strong>Bairro:</strong> {order.address_neighborhood}</p>
                  {order.address_complement && (
                    <p className="text-sm text-amber-700"><strong>Complemento:</strong> {order.address_complement}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-2">Itens do Pedido:</p>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-sm text-amber-700">
                        {item.quantity}x {item.name} - R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-amber-200">
                {activeTab === 'pending' && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'accepted')}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      <span>Aceitar</span>
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'deleted')}
                      className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all shadow-md"
                    >
                      <X className="w-4 h-4" />
                      <span>Recusar</span>
                    </button>
                  </>
                )}

                {activeTab === 'accepted' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'deleted')}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all shadow-md"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                )}

                {activeTab === 'deleted' && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'pending')}
                      className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-all shadow-md"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restaurar para Pendente</span>
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'accepted')}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mover para Aceitos</span>
                    </button>
                    <button
                      onClick={() => deleteOrderPermanently(order.id)}
                      className="flex items-center space-x-2 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-all shadow-md"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Excluir Permanentemente</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
