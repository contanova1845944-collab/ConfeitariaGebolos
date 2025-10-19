import React, { useState, useEffect } from 'react';
import { X, Settings, Package, ShoppingBag, BarChart, Trash2, Check } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { supabase, Product, Order, SiteSettings } from '../lib/supabase';

export const AdminPanel: React.FC = () => {
  const { logout } = useAdmin();
  const [activeTab, setActiveTab] = useState<'products' | 'settings' | 'orders' | 'analytics'>('orders');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deletedOrders, setDeletedOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchSettings();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  const fetchOrders = async () => {
    const { data: pending } = await supabase.from('orders').select('*').in('status', ['pending', 'accepted']).order('created_at', { ascending: false });
    const { data: deleted } = await supabase.from('orders').select('*').eq('status', 'deleted').order('created_at', { ascending: false });
    if (pending) setOrders(pending);
    if (deleted) setDeletedOrders(deleted);
  };

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*').maybeSingle();
    if (data) setSettings(data);
  };

  const handleUpdateProduct = async (product: Product) => {
    const { error } = await supabase.from('products').update({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
    }).eq('id', product.id);

    if (!error) {
      fetchProducts();
      setEditingProduct(null);
    }
  };

  const handleUpdateSettings = async () => {
    if (!settings) return;
    const { error } = await supabase.from('site_settings').update({
      logo_url: settings.logo_url,
      instagram_url: settings.instagram_url,
      contact_phone: settings.contact_phone,
      pix_key: settings.pix_key,
      pix_qr_code_url: settings.pix_qr_code_url,
    }).eq('id', settings.id);

    if (!error) {
      alert('Configurações atualizadas com sucesso!');
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    const { error } = await supabase.from('orders').update({ status: 'accepted' }).eq('id', orderId);
    if (!error) fetchOrders();
  };

  const handleDeleteOrder = async (orderId: string) => {
    const { error } = await supabase.from('orders').update({ status: 'deleted' }).eq('id', orderId);
    if (!error) fetchOrders();
  };

  const handlePermanentDelete = async (orderId: string) => {
    const { error } = await supabase.from('orders').delete().eq('id', orderId);
    if (!error) fetchOrders();
  };

  const getProductSales = () => {
    const sales: { [key: string]: { name: string; count: number } } = {};

    orders.filter(o => o.status === 'accepted').forEach(order => {
      order.items.forEach(item => {
        if (!sales[item.product_id]) {
          sales[item.product_id] = { name: item.name, count: 0 };
        }
        sales[item.product_id].count += item.quantity;
      });
    });

    return Object.entries(sales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-7xl mx-auto my-8">
          <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-6 flex items-center justify-between border-b-4 border-rose-300 rounded-t-2xl">
            <h2 className="text-3xl font-serif text-amber-900">Painel Administrativo</h2>
            <button onClick={logout} className="text-amber-900 hover:text-rose-600">
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex border-b-2 border-amber-200">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 font-semibold flex items-center justify-center space-x-2 ${
                activeTab === 'orders' ? 'bg-rose-100 text-rose-700' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Pedidos</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-4 font-semibold flex items-center justify-center space-x-2 ${
                activeTab === 'products' ? 'bg-rose-100 text-rose-700' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Produtos</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-4 font-semibold flex items-center justify-center space-x-2 ${
                activeTab === 'analytics' ? 'bg-rose-100 text-rose-700' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <BarChart className="w-5 h-5" />
              <span>Análises</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 font-semibold flex items-center justify-center space-x-2 ${
                activeTab === 'settings' ? 'bg-rose-100 text-rose-700' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif text-amber-900 mb-4">Pedidos Pendentes e Aceitos</h3>
                  {orders.length === 0 ? (
                    <p className="text-amber-700">Nenhum pedido no momento.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-gradient-to-r from-amber-50 to-rose-50 p-4 rounded-xl border-2 border-amber-200">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-amber-900">{order.customer_name}</p>
                              <p className="text-sm text-amber-700">{order.customer_phone}</p>
                              <p className="text-sm text-amber-700">
                                {order.address_street}, {order.address_number} - {order.address_neighborhood}
                              </p>
                              {order.address_complement && (
                                <p className="text-sm text-amber-700">{order.address_complement}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-rose-600">R$ {order.total_amount.toFixed(2)}</p>
                              <span className={`text-xs px-2 py-1 rounded ${order.status === 'accepted' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                {order.status === 'accepted' ? 'Aceito' : 'Pendente'}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2 mb-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-sm text-amber-800">
                                {item.quantity}x {item.name} - R$ {(item.price * item.quantity).toFixed(2)}
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleAcceptOrder(order.id)}
                                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center space-x-2"
                              >
                                <Check className="w-4 h-4" />
                                <span>Aceitar</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              className="flex-1 bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 flex items-center justify-center space-x-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Excluir</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-serif text-amber-900 mb-4">Pedidos Excluídos</h3>
                  {deletedOrders.length === 0 ? (
                    <p className="text-amber-700">Nenhum pedido excluído.</p>
                  ) : (
                    <div className="space-y-4">
                      {deletedOrders.map((order) => (
                        <div key={order.id} className="bg-gray-100 p-4 rounded-xl border-2 border-gray-300 opacity-75">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-gray-700">{order.customer_name}</p>
                              <p className="text-sm text-gray-600">R$ {order.total_amount.toFixed(2)}</p>
                            </div>
                            <button
                              onClick={() => handlePermanentDelete(order.id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                            >
                              Excluir Permanentemente
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-amber-900 mb-4">Gerenciar Produtos</h3>
                {products.map((product) => (
                  <div key={product.id} className="bg-gradient-to-r from-amber-50 to-rose-50 p-4 rounded-xl border-2 border-amber-200">
                    {editingProduct?.id === product.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-amber-300 rounded"
                          placeholder="Nome"
                        />
                        <textarea
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-amber-300 rounded"
                          placeholder="Descrição"
                          rows={3}
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border-2 border-amber-300 rounded"
                          placeholder="Preço"
                        />
                        <input
                          type="text"
                          value={editingProduct.image_url}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-amber-300 rounded"
                          placeholder="URL da Imagem"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateProduct(editingProduct)}
                            className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-bold text-amber-900">{product.name}</p>
                          <p className="text-sm text-amber-700">{product.description}</p>
                          <p className="text-rose-600 font-bold">R$ {product.price.toFixed(2)}</p>
                          <span className="text-xs bg-amber-200 px-2 py-1 rounded">{product.category}</span>
                        </div>
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
                        >
                          Editar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-serif text-amber-900 mb-4">Análise de Vendas</h3>
                <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-6 rounded-xl border-2 border-amber-200">
                  <h4 className="text-xl font-serif text-amber-900 mb-4">Produtos Mais Vendidos</h4>
                  <div className="space-y-3">
                    {getProductSales().map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-rose-500">#{index + 1}</span>
                          <span className="text-amber-900">{item.name}</span>
                        </div>
                        <span className="text-xl font-bold text-amber-700">{item.count} vendidos</span>
                      </div>
                    ))}
                    {getProductSales().length === 0 && (
                      <p className="text-amber-700">Nenhuma venda registrada ainda.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && settings && (
              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-amber-900 mb-4">Configurações do Site</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-amber-900 font-semibold mb-2">URL do Logo</label>
                    <input
                      type="text"
                      value={settings.logo_url}
                      onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-900 font-semibold mb-2">URL do Instagram</label>
                    <input
                      type="text"
                      value={settings.instagram_url}
                      onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-900 font-semibold mb-2">Telefone de Contato</label>
                    <input
                      type="text"
                      value={settings.contact_phone}
                      onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-900 font-semibold mb-2">Chave Pix</label>
                    <input
                      type="text"
                      value={settings.pix_key}
                      onChange={(e) => setSettings({ ...settings, pix_key: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-900 font-semibold mb-2">URL do QR Code Pix</label>
                    <input
                      type="text"
                      value={settings.pix_qr_code_url}
                      onChange={(e) => setSettings({ ...settings, pix_qr_code_url: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg"
                    />
                  </div>
                  <button
                    onClick={handleUpdateSettings}
                    className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-amber-600"
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
