import { defineConfig } from 'vite';
import reagir from '@vitejs/plugin-react'; // 'reagir' deve ser 'react' na instalação

// https://vitejs.dev/config/
export default defineConfig({
  // 💥 CORREÇÃO PRINCIPAL: Adicionando a base para o Vercel
  base: '/', 
  
  plugins: [reagir()],
  otimizarDeps: {
    excluir: ['lúcido-reagir'],
  },
});
