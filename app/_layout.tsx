/**
 * app/_layout.tsx — Layout Raiz da Aplicação (Expo Router)
 *
 * O que é um Layout no Expo Router?
 * ──────────────────────────────────
 * No Expo Router (sistema de roteamento baseado em arquivos), arquivos
 * chamados `_layout.tsx` definem o WRAPPER de um grupo de rotas.
 *
 * O arquivo `app/_layout.tsx` especificamente é o layout RAIZ — ele
 * envolve TODAS as telas do app. É aqui que configuramos:
 * - O tipo de navegação (Stack, Tabs, Drawer...)
 * - Estilos globais do header
 * - Providers de contexto (tema, autenticação, etc.)
 * - Importação do CSS global (NativeWind)
 *
 * Stack Navigation:
 * ─────────────────
 * A navegação em "pilha" (stack) funciona como uma pilha de cartas:
 * - `router.push(rota)` → adiciona uma tela no TOPO da pilha
 * - `router.back()` ou o botão "voltar" → REMOVE a tela do topo
 * - A tela de baixo sempre é preservada na memória
 *
 * Fluxo neste app:
 *   [index.tsx] → push('/form') → [form.tsx]
 *   [form.tsx]  → back()        → [index.tsx]  ← recarregada pelo useFocusEffect
 *
 * Importação do CSS Global:
 * ─────────────────────────
 * `import '../global.css'` DEVE estar neste arquivo (o layout raiz).
 * É executado uma única vez no início do app, registrando todos os
 * estilos Tailwind com o NativeWind antes de qualquer tela ser renderizada.
 */

// ⚠️ IMPORTANTE: esta importação DEVE ser a primeira do arquivo!
// O NativeWind precisa processar o CSS antes de qualquer componente ser montado.
import '../global.css';

import { Stack } from 'expo-router';

/**
 * Componente de layout raiz da aplicação.
 *
 * O `<Stack>` do Expo Router gerencia automaticamente:
 * - Animações de transição entre telas
 * - Botão "voltar" no header
 * - Histórico de navegação
 *
 * `screenOptions`: configurações padrão aplicadas a TODAS as telas.
 *   Cada `<Stack.Screen>` pode sobrescrever essas opções individualmente.
 *
 * `contentStyle`: estilo do conteúdo abaixo do header (a área da tela).
 */
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        // Cor de fundo do header — mesma em todas as telas
        headerStyle: { backgroundColor: '#4f46e5' }, // indigo-600

        // Cor do texto e ícones do header (título, botão voltar)
        headerTintColor: '#ffffff',

        // Estilo do título no header
        headerTitleStyle: { fontWeight: 'bold' },

        // Cor de fundo da área de conteúdo (abaixo do header)
        contentStyle: { backgroundColor: '#f9fafb' }, // gray-50
      }}
    >
      {/*
       * Cada <Stack.Screen> registra uma rota e suas opções de header.
       * O atributo `name` corresponde ao NOME DO ARQUIVO em app/:
       *   name="index" → app/index.tsx
       *   name="form"  → app/form.tsx
       *
       * Rotas não listadas aqui ainda funcionam — assumem as screenOptions padrão.
       */}
      <Stack.Screen
        name="index"
        options={{
          title: '📋 Minhas Tarefas',
        }}
      />
      <Stack.Screen
        name="form"
        options={{
          // Título padrão — sobrescrito dinamicamente em app/form.tsx
          // usando `navigation.setOptions({ title: '...' })`
          title: 'Nova Tarefa',
        }}
      />
    </Stack>
  );
}
