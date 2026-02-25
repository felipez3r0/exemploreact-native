/**
 * index.ts — Ponto de entrada legado (NÃO utilizado com Expo Router)
 *
 * Em projetos React Native tradicionais sem Expo Router, este arquivo era
 * o ponto de entrada do aplicativo. Ele chamava `registerRootComponent`
 * para registrar o componente raiz (App.tsx) no sistema nativo.
 *
 * COM O EXPO ROUTER, este arquivo é ignorado.
 *
 * O Expo Router usa seu próprio sistema de entrada definido em:
 *   package.json → "main": "expo-router/entry"
 *
 * Isso significa que o Expo Router controla o roteamento a partir da
 * pasta `app/`, usando o sistema de rotas baseado em arquivos (file-based routing).
 *
 * Estrutura de rotas:
 *   app/_layout.tsx  → Layout raiz (equivalente ao "App.tsx" antigo)
 *   app/index.tsx    → Rota principal ("/" ou tela inicial)
 *   app/form.tsx     → Rota "/form" (tela de formulário)
 *
 * Você pode manter este arquivo no projeto — ele simplesmente não será usado.
 */
