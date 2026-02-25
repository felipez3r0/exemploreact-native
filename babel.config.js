/**
 * babel.config.js — Configuração do compilador Babel
 *
 * O Babel é o transpilador que converte nosso código TypeScript/JSX moderno
 * em JavaScript que os dispositivos conseguem executar.
 *
 * Configurações importantes:
 *
 * 1. `babel-preset-expo`: preset padrão do Expo que já inclui suporte a
 *    TypeScript, JSX, importações de módulos etc.
 *
 * 2. `jsxImportSource: "nativewind"`: faz o NativeWind interceptar a criação
 *    de elementos JSX para processar a prop `className` antes de chegar
 *    no React Native. É assim que o Tailwind funciona no React Native!
 *
 * 3. `"nativewind/babel"`: preset adicional do NativeWind que converte
 *    as classes Tailwind (ex: "flex-1 bg-white") em StyleSheets do React Native
 *    no momento do build.
 *
 * 4. `react-native-reanimated/plugin`: OBRIGATÓRIO para o React Native Reanimated
 *    funcionar. DEVE ser sempre o ÚLTIMO plugin da lista.
 *
 * Documentação: https://nativewindcss.com/docs/v4/getting-started/expo-router
 */
module.exports = function (api) {
  // api.cache(true) instrui o Babel a cachear o resultado desta função.
  // Isso acelera bastante o tempo de compilação em desenvolvimento.
  api.cache(true);

  return {
    presets: [
      // Preset principal do Expo, com NativeWind como fonte de JSX
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      // Preset do NativeWind para processar as classes Tailwind
      "nativewind/babel",
    ],
    plugins: [
      // Plugin do Reanimated — deve vir POR ÚLTIMO na lista de plugins
      "react-native-reanimated/plugin",
    ],
  };
};
