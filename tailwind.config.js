/**
 * tailwind.config.js — Configuração do Tailwind CSS para React Native
 *
 * O Tailwind CSS é um framework de utilitários CSS que permite estilizar
 * componentes usando classes pré-definidas diretamente no JSX/TSX.
 *
 * Exemplo de uso:
 *   <View className="flex-1 bg-white p-4">        →  flex: 1, backgroundColor: '#fff', padding: 16
 *   <Text className="text-xl font-bold text-indigo-600">  →  fontSize: 20, fontWeight: 'bold', color: '#4f46e5'
 *
 * Propriedades importantes:
 *
 * `content`: lista de todos os arquivos que contêm classes Tailwind.
 *   O Tailwind analisa esses arquivos e gera APENAS o CSS das classes que
 *   realmente são usadas. Isso mantém o bundle pequeno.
 *
 * `presets: [require("nativewind/preset")]`: adiciona as configurações
 *   específicas do NativeWind como suporte a modo escuro, unidades responsivas etc.
 *
 * Documentação: https://tailwindcss.com/docs/configuration
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Arquivos que serão escaneados em busca de classes Tailwind
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",   // Todas as telas (Expo Router)
    "./src/**/*.{js,jsx,ts,tsx}",   // Todos os componentes/hooks/etc.
  ],

  // Preset do NativeWind com configurações otimizadas para React Native
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      // Aqui você pode adicionar cores, espaçamentos, fontes customizados.
      // Exemplo:
      // colors: {
      //   primary: '#4f46e5',
      // }
    },
  },

  plugins: [],
};
