import React, { useState, useEffect } from 'react';

const phrases = [
  'Doçura que transforma momentos em memórias',
  'Feito com amor, servido com carinho',
  'Cada fatia é uma celebração',
  'Sabores que aquecem o coração',
  'A vida é curta, coma o bolo primeiro',
  'Onde cada bolo conta uma história deliciosa'
];

export const Banner: React.FC = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 md:h-96 bg-gradient-to-br from-amber-100 via-rose-100 to-amber-200 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg')] bg-cover bg-center opacity-20"></div>

      <div className="relative h-full flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-3xl">
          <h2 className="text-3xl md:text-5xl text-amber-900 transition-all duration-1000 animate-fade-in" style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 600 }}>
            {phrases[currentPhrase]}
          </h2>
          <div className="flex justify-center">
            <div className="flex space-x-2 mt-4">
              {phrases.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentPhrase ? 'bg-rose-500 w-8' : 'bg-amber-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
