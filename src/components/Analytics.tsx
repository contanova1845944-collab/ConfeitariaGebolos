import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, BarChart3 } from 'lucide-react';
import { supabase, ProductSales, Product } from '../lib/supabase';

export const Analytics: React.FC = () => {
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);

    const { data: salesData } = await supabase
      .from('product_sales')
      .select('*')
      .order('quantity_sold', { ascending: false });

    const { data: productsData } = await supabase
      .from('products')
      .select('*');

    const { data: ordersData } = await supabase
      .from('orders')
      .select('total_amount, status')
      .eq('status', 'accepted');

    if (salesData) setProductSales(salesData);
    if (productsData) setProducts(productsData);

    if (ordersData) {
      const revenue = ordersData.reduce((sum, order) => sum + order.total_amount, 0);
      setTotalRevenue(revenue);
      setTotalOrders(ordersData.length);
    }

    setLoading(false);
  };

  const getProductsWithoutSales = () => {
    const soldProductIds = new Set(productSales.map(sale => sale.product_id));
    return products.filter(product => !soldProductIds.has(product.id));
  };

  const bestSellingProducts = productSales.slice(0, 5);
  const worstSellingProducts = [...productSales].reverse().slice(0, 5);
  const productsWithoutSales = getProductsWithoutSales();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-amber-900">Análises e Estatísticas</h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
          <p className="mt-4 text-amber-700">Carregando análises...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-green-900">Receita Total</h3>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-700">{formatCurrency(totalRevenue)}</p>
              <p className="text-sm text-green-600 mt-1">De pedidos aceitos</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-blue-900">Total de Pedidos</h3>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-700">{totalOrders}</p>
              <p className="text-sm text-blue-600 mt-1">Pedidos aceitos</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-purple-900">Produtos Vendidos</h3>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-purple-700">{productSales.length}</p>
              <p className="text-sm text-purple-600 mt-1">Produtos diferentes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-green-300 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-serif text-green-900">Produtos Mais Vendidos</h3>
              </div>
              {bestSellingProducts.length === 0 ? (
                <p className="text-amber-700 text-center py-4">Nenhuma venda registrada ainda</p>
              ) : (
                <div className="space-y-3">
                  {bestSellingProducts.map((sale, index) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white font-bold rounded-full text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-green-900">{sale.product_name}</p>
                          <p className="text-xs text-green-600">
                            Última venda: {formatDate(sale.last_sale_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-700">{sale.quantity_sold} vendas</p>
                        <p className="text-sm text-green-600">{formatCurrency(sale.total_revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border-2 border-orange-300 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingDown className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-serif text-orange-900">Produtos Menos Vendidos</h3>
              </div>
              {worstSellingProducts.length === 0 ? (
                <p className="text-amber-700 text-center py-4">Nenhuma venda registrada ainda</p>
              ) : (
                <div className="space-y-3">
                  {worstSellingProducts.map((sale, index) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white font-bold rounded-full text-sm">
                          {worstSellingProducts.length - index}
                        </span>
                        <div>
                          <p className="font-semibold text-orange-900">{sale.product_name}</p>
                          <p className="text-xs text-orange-600">
                            Última venda: {formatDate(sale.last_sale_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-700">{sale.quantity_sold} vendas</p>
                        <p className="text-sm text-orange-600">{formatCurrency(sale.total_revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {productsWithoutSales.length > 0 && (
            <div className="bg-white border-2 border-red-300 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Package className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-serif text-red-900">Produtos Sem Vendas</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {productsWithoutSales.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-red-900 text-sm">{product.name}</p>
                      <p className="text-xs text-red-600">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {productSales.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-rose-50 border-2 border-amber-300 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-serif text-amber-900 mb-4">Todos os Produtos Vendidos</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-amber-200 text-amber-900">
                      <th className="px-4 py-3 text-left font-semibold">Posição</th>
                      <th className="px-4 py-3 text-left font-semibold">Produto</th>
                      <th className="px-4 py-3 text-right font-semibold">Quantidade</th>
                      <th className="px-4 py-3 text-right font-semibold">Receita</th>
                      <th className="px-4 py-3 text-center font-semibold">Última Venda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productSales.map((sale, index) => (
                      <tr
                        key={sale.id}
                        className={`border-b border-amber-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-amber-50'
                        } hover:bg-amber-100 transition-colors`}
                      >
                        <td className="px-4 py-3 text-amber-900 font-semibold">{index + 1}º</td>
                        <td className="px-4 py-3 text-amber-900">{sale.product_name}</td>
                        <td className="px-4 py-3 text-right text-amber-900 font-semibold">
                          {sale.quantity_sold}
                        </td>
                        <td className="px-4 py-3 text-right text-green-700 font-bold">
                          {formatCurrency(sale.total_revenue)}
                        </td>
                        <td className="px-4 py-3 text-center text-amber-700 text-sm">
                          {formatDate(sale.last_sale_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
