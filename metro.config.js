/**
 * metro.config.js — Configuração do Metro Bundler
 *
 * O Metro é o bundler (empacotador) padrão do React Native. Ele é responsável
 * por resolver importações, transformar TypeScript/JSX e empacotar o código
 * em um único arquivo JavaScript que o app consegue executar.
 *
 * `getDefaultConfig`: retorna a configuração padrão do Metro para projetos Expo.
 *
 * `withNativeWind`: envolve a configuração com um plugin do NativeWind que:
 *   - Adiciona um transformador para processar o arquivo global.css
 *   - Habilita o suporte a classes Tailwind via `className` nas Views
 *   - Gera o cache de estilos em desenvolvimento para hot reload funcionar
 *
 * A opção `input: './global.css'` aponta para o arquivo CSS que contém
 * as diretivas @tailwind que vimos no global.css.
 *
 * Documentação Metro: https://metrobundler.dev/docs/configuration
 * Documentação NativeWind: https://www.nativewind.dev/v4/getting-started/metro
 */

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Obtém a configuração padrão do Metro para este projeto Expo
const config = getDefaultConfig(__dirname);

// Aplica o plugin do NativeWind na configuração,
// apontando para nosso arquivo CSS de entrada.
module.exports = withNativeWind(config, { input: "./global.css" });
