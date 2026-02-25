/**
 * nativewind-env.d.ts — Declarações de tipo para NativeWind
 *
 * Por padrão, o TypeScript não reconhece a prop `className` nos componentes
 * do React Native (como View, Text, TouchableOpacity etc.), porque ela não
 * existe na definição de tipos padrão do React Native.
 *
 * Esta referência importa as declarações de tipo do NativeWind v4, que
 * adicionam suporte à prop `className` em todos os componentes core do RN.
 *
 * Sem este arquivo, você veria erros como:
 *   TS2322: Property 'className' does not exist on type 'ViewProps'
 *
 * Com este arquivo, o TypeScript sabe que `className` é válido e até
 * provê autocompletar para as classes Tailwind!
 */

/// <reference types="nativewind/types" />
