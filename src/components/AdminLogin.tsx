import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';

export const AdminLogin: React.FC = () => {
  const { login, closeAdminPanel } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (!success) {
      setError('Email ou senha incorretos');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-amber-100 to-rose-100 p-6 flex items-center justify-between border-b-4 border-rose-300 rounded-t-2xl">
          <h2 className="text-2xl font-serif text-amber-900">Admin Login</h2>
          <button onClick={closeAdminPanel} className="text-amber-900 hover:text-rose-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-amber-900 font-semibold mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-rose-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-amber-900 font-semibold mb-2">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-rose-400 focus:outline-none"
            />
          </div>

          {error && (
            <div className="bg-rose-100 border-2 border-rose-300 text-rose-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-amber-600 transition-all shadow-lg"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
