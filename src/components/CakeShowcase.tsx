import React, { useState, useEffect } from 'react';
import { supabase, Product } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';

export const CakeShowcase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchShowcaseProducts();
  }, []);

  const fetchShowcaseProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'showcase')
      .limit(3);
    if (data) setProducts(data);
  };

  const handleCardClick = (id: string) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
  };

  return (
    <div className="py-16 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-amber-900 mb-12">
          Nossas Criações Especiais
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="perspective-1000 h-96 cursor-pointer"
              onClick={() => handleCardClick(product.id)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
                  flippedCard === product.id ? 'rotate-y-180' : ''
                }`}
              >
                <div className="absolute w-full h-full backface-hidden">
                  <div className="h-full bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center border-4 border-amber-200 hover:border-rose-300 transition-colors">
                    <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-serif text-amber-900 text-center mb-2">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold text-rose-600">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-amber-700 mt-2 text-center italic">
                      Clique para ver detalhes
                    </p>
                  </div>
                </div>

                <div className="absolute w-full h-full backface-hidden rotate-y-180">
                  <div className="h-full bg-gradient-to-br from-amber-50 to-rose-50 rounded-xl shadow-xl p-6 flex flex-col justify-between border-4 border-rose-300">
                    <div>
                      <h3 className="text-xl font-serif text-amber-900 mb-4 text-center">
                        {product.name}
                      </h3>
                      <p className="text-amber-800 text-sm leading-relaxed mb-4">
                        {product.description}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-2xl font-bold text-rose-600 text-center">
                        R$ {product.price.toFixed(2)}
                      </p>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-amber-600 transition-all shadow-md"
                      >
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
