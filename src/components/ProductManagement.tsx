import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import { supabase, Product } from '../lib/supabase';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'menu' as 'menu' | 'showcase',
    type: 'Gourmet'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.image_url) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image_url: formData.image_url,
      category: formData.category,
      type: formData.type,
      updated_at: new Date().toISOString()
    };

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);

      if (!error) {
        alert('Produto atualizado com sucesso!');
        resetForm();
        fetchProducts();
      } else {
        alert('Erro ao atualizar produto.');
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);

      if (!error) {
        alert('Produto criado com sucesso!');
        resetForm();
        fetchProducts();
      } else {
        alert('Erro ao criar produto.');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url,
      category: product.category,
      type: product.type
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (!error) {
      alert('Produto excluído com sucesso!');
      fetchProducts();
    } else {
      alert('Erro ao excluir produto.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: '',
      category: 'menu',
      type: 'Gourmet'
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const categories = ['Chocolate', 'Frutas', 'Tradicional', 'Gourmet', 'Especial'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-amber-900">Gerenciar Produtos</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-amber-600 transition-all shadow-md"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{showForm ? 'Cancelar' : 'Novo Produto'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-amber-50 to-rose-50 border-2 border-amber-300 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-serif text-amber-900 mb-4">
            {editingProduct ? 'Editar Produto' : 'Criar Novo Produto'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:border-rose-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:border-rose-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Categoria *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:border-rose-400 focus:outline-none"
                  required
                >
                  <option value="menu">Cardápio</option>
                  <option value="showcase">Vitrine</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Tipo *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:border-rose-400 focus:outline-none"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Descrição *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:border-rose-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                URL da Imagem *
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="flex-1 px-4 py-2 border-2 border-amber-300 rounded-lg focus:border-rose-400 focus:outline-none"
                  required
                />
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg border-2 border-amber-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/64?text=Erro';
                    }}
                  />
                )}
              </div>
              <p className="text-xs text-amber-600 mt-1">
                Cole o link direto da imagem (exemplo: Pexels, Unsplash, ou upload em serviço de imagens)
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all shadow-md"
              >
                <Save className="w-5 h-5" />
                <span>{editingProduct ? 'Atualizar' : 'Salvar'} Produto</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all shadow-md"
              >
                <X className="w-5 h-5" />
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent"></div>
          <p className="mt-4 text-amber-700">Carregando produtos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border-2 border-amber-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {product.type}
                  </span>
                  <span className={`text-white px-2 py-1 rounded-full text-xs font-semibold ${
                    product.category === 'menu' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}>
                    {product.category === 'menu' ? 'Cardápio' : 'Vitrine'}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="text-lg font-serif text-amber-900">{product.name}</h3>
                <p className="text-sm text-amber-700 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-bold text-rose-600">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
