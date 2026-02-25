/**
 * App.tsx — Componente raiz legado (NÃO utilizado com Expo Router)
 *
 * Em projetos React Native sem Expo Router, este era o componente raiz
 * do aplicativo — a "primeira tela" que o usuário via ao abrir o app.
 *
 * COM O EXPO ROUTER, este arquivo é ignorado.
 *
 * O layout raiz agora é definido em: app/_layout.tsx
 * A tela inicial agora é definida em: app/index.tsx
 *
 * Por que o Expo Router é melhor?
 * - Navegação baseada em arquivos (como Next.js): criar um arquivo = criar uma rota
 * - Deep linking automático (abrir o app direto em uma tela via URL)
 * - Layouts compartilhados com aninhamento simples
 * - Tipagem de parâmetros de rota com TypeScript
 *
 * Você pode manter este arquivo no projeto — ele simplesmente não será usado.
 */
