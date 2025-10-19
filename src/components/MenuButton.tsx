import React from 'react';
import { ChefHat } from 'lucide-react';

interface MenuButtonProps {
  onClick: () => void;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => {
  return (
    <div className="py-12 bg-white flex justify-center">
      <button
        onClick={onClick}
        className="group relative px-12 py-6 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 text-white text-xl md:text-2xl font-serif rounded-full shadow-2xl hover:shadow-rose-300 transition-all duration-300 hover:scale-105 flex items-center space-x-3"
      >
        <ChefHat className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <span>Ver Cardápio Completo</span>
      </button>
    </div>
  );
};
