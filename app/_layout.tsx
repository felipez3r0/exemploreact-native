/**
 * app/_layout.tsx — Layout Raiz da Aplicação (Expo Router) + Autenticação
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
 * Novidade neste arquivo:
 * ───────────────────────
 * Após adicionar autenticação, este arquivo foi modificado para incluir:
 * 1. `<AuthProvider>` → provê o contexto de autenticação globalmente
 * 2. `RootLayoutNav` → componente separado com lógica de proteção de rotas
 *
 * Por que dois componentes?
 * ─────────────────────────
 * `RootLayout` (este componente):
 *   - Envolve tudo no `<AuthProvider>`
 *   - NÃO pode usar `useAuthContext()` (pois está FORA do Provider)
 *
 * `RootLayoutNav` (componente filho):
 *   - Está DENTRO do `<AuthProvider>`
 *   - PODE usar `useAuthContext()` para acessar `user` e `loading`
 *   - Implementa a lógica de redirecionamento baseada em autenticação
 *
 * Stack Navigation:
 * ─────────────────
 * A navegação em "pilha" (stack) funciona como uma pilha de cartas:
 * - `router.push(rota)` → adiciona uma tela no TOPO da pilha
 * - `router.back()` ou o botão "voltar" → REMOVE a tela do topo
 * - A tela de baixo sempre é preservada na memória
 *
 * Fluxo neste app (SEM autenticação):
 *   [index.tsx] → push('/form') → [form.tsx]
 *   [form.tsx]  → back()        → [index.tsx]  ← recarregada pelo useFocusEffect
 *
 * Fluxo neste app (COM autenticação):
 *   Usuário NÃO logado → redirecionado automaticamente para /login
 *   Usuário logado → acessa index, form, profile normalmente
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

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuthContext } from '../src/contexts/AuthContext';

/**
 * Componente de layout raiz da aplicação.
 *
 * Este componente envolve TODA a aplicação no `<AuthProvider>`, permitindo
 * que qualquer tela acesse o contexto de autenticação via `useAuthContext()`.
 *
 * Estrutura de componentes:
 * ─────────────────────────
 * <RootLayout>                  ← Fornece o AuthProvider
 *   <AuthProvider>
 *     <RootLayoutNav>          ← Consome o AuthProvider (redirecionamentos)
 *       <Stack>
 *         <Screen login />
 *         <Screen register />
 *         <Screen index />
 *         <Screen form />
 *         <Screen profile />
 *       </Stack>
 *     </RootLayoutNav>
 *   </AuthProvider>
 * </RootLayout>
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

/**
 * Componente de navegação com proteção de rotas.
 *
 * Este componente implementa a lógica de **redirecionamento automático**
 * baseado no estado de autenticação:
 *
 * - Se o usuário NÃO está logado → redireciona para /login
 * - Se o usuário está logado E está em /login ou /register → redireciona para /
 *
 * Por que separar este componente?
 * ────────────────────────────────
 * Porque ele precisa chamar `useAuthContext()` para acessar `user` e `loading`,
 * mas o `RootLayout` está FORA do `<AuthProvider>`. Só componentes DENTRO do
 * Provider podem consumir o contexto.
 *
 * Proteção de rotas — Como funciona:
 * ──────────────────────────────────
 * O `useEffect` abaixo monitora mudanças em `user` e no segmento atual da rota.
 * Quando detecta uma incompatibilidade (ex: user=null mas rota=index), redireciona.
 *
 * `useSegments()`:
 * ────────────────
 * Retorna um array com os segmentos da rota atual.
 * Exemplos:
 *   Rota: /login         → segments: ['login']
 *   Rota: /              → segments: ['index']
 *   Rota: /form          → segments: ['form']
 *   Rota: /profile       → segments: ['profile']
 *
 * Usamos `segments[0]` para pegar o primeiro segmento e decidir se é uma
 * rota de autenticação (login/register) ou uma rota protegida (index/form/profile).
 *
 * `router.replace()` vs. `router.push()`:
 * ────────────────────────────────────────
 * - `push()` → adiciona na pilha de navegação (usuário pode voltar)
 * - `replace()` → SUBSTITUI a rota atual (usuário NÃO pode voltar)
 *
 * Usamos `replace()` porque:
 * - Se redirecionarmos de /index para /login com `push()`, o botão voltar
 *   levaria o usuário de volta para /index — mas ele não está logado! Loop infinito.
 * - Com `replace()`, /login SUBSTITUI /index no histórico → não há como voltar.
 */
function RootLayoutNav() {
  const { user, loading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  /**
   * Efeito que implementa a proteção de rotas.
   *
   * Executado sempre que `user`, `loading` ou a rota (`segments`) mudarem.
   *
   * Lógica:
   * ───────
   * 1. Se ainda está carregando (verificando token inicial) → NÃO redireciona
   *    (evita flash de telas durante a verificação)
   *
   * 2. Se usuário NÃO está logado E não está em rota de auth → redireciona para /login
   *
   * 3. Se usuário está logado E está em rota de auth → redireciona para /
   *    (usuário já logado não precisa ver tela de login)
   *
   * Rotas de autenticação:
   * ──────────────────────
   * São as rotas que usuários NÃO autenticados podem acessar: /login e /register.
   * Todas as outras rotas (index, form, profile) são PROTEGIDAS.
   */
  useEffect(() => {
    if (loading) {
      // Ainda verificando o estado de autenticação inicial — não redireciona
      return;
    }

    // Verifica se a rota atual é de autenticação (login ou register)
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (!user && !inAuthGroup) {
      // Usuário NÃO logado tentando acessar rota protegida → redireciona para login
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Usuário JÁ logado tentando acessar login/register → redireciona para home
      router.replace('/');
    }
  }, [user, loading, segments]);

  /**
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
       * Rotas de Autenticação (públicas — não exigem login)
       * ────────────────────────────────────────────────────
       * `headerShown: false` remove o header destas telas, dando mais espaço
       * para o formulário e melhorando a UX.
       */}
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />

      {/*
       * Rotas Protegidas (exigem autenticação)
       * ───────────────────────────────────────
       * Se o usuário não estiver logado, o useEffect acima redirecionará
       * automaticamente para /login antes destas telas serem renderizadas.
       *
       * Cada <Stack.Screen> registra uma rota e suas opções de header.
       * O atributo `name` corresponde ao NOME DO ARQUIVO em app/:
       *   name="index" → app/index.tsx
       *   name="form"  → app/form.tsx
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
      <Stack.Screen
        name="profile"
        options={{
          title: '👤 Meu Perfil',
        }}
      />
    </Stack>
  );
}
