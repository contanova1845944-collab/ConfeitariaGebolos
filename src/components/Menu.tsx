import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';

interface MenuProps {
  onClose: () => void;
}

export const Menu: React.FC<MenuProps> = ({ onClose }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenuProducts();
  }, []);

  const fetchMenuProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'menu');
    if (data) setProducts(data);
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
  };

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.type)))];
  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.type === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-r from-amber-100 to-rose-100 p-6 border-b-4 border-rose-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-serif text-amber-900">Nosso Cardápio</h2>
            <button
              onClick={onClose}
              className="text-amber-900 hover:text-rose-600 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                    : 'bg-white text-amber-800 border-2 border-amber-300 hover:border-rose-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-amber-700 text-lg py-8">
              Nenhum produto encontrado nesta categoria.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-lg overflow-hidden border-2 border-amber-200 hover:border-rose-300 transition-all hover:shadow-xl"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {product.type}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <h3 className="text-xl font-serif text-amber-900">{product.name}</h3>
                    <p className="text-sm text-amber-800 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold text-rose-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-rose-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
