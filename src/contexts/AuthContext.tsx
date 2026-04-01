/**
 * src/contexts/AuthContext.tsx — Contexto Global de Autenticação
 *
 * Este arquivo introduz um novo conceito: **React Context API**.
 *
 * O que é Context e por que usá-lo?
 * ─────────────────────────────────
 * Até agora, compartilhamos estado entre componentes de duas formas:
 *
 * 1. **Props** — passando dados de pai para filho:
 *    ```tsx
 *    <TaskItem task={task} onToggle={handleToggle} />
 *    ```
 *    Problema: se precisarmos passar `user` para 5 níveis de componentes,
 *    teríamos que adicionar a prop em TODOS eles (prop drilling).
 *
 * 2. **Hooks isolados** — cada componente chama seu próprio hook:
 *    ```tsx
 *    const { tasks } = useTasks();
 *    ```
 *    Problema: cada chamada de `useTasks()` cria um ESTADO SEPARADO.
 *    Se TaskList e TaskForm ambos chamam `useTasks()`, eles não compartilham
 *    o mesmo array de tarefas!
 *
 * **Context resolve ambos os problemas:**
 * ───────────────────────────────────────
 * - Um ÚNICO estado global, compartilhado por todos os componentes
 * - Qualquer componente pode acessar sem precisar receber via props
 * - Ideal para dados que "muitos componentes precisam" (ex: usuário autenticado)
 *
 * Quando usar Context?
 * ────────────────────
 * ✅ Autenticação (user, login, logout)
 * ✅ Tema (dark mode / light mode)
 * ✅ Idioma (i18n)
 * ✅ Configurações globais
 *
 * Quando NÃO usar Context?
 * ─────────────────────────
 * ❌ Estado local de um único componente (use useState)
 * ❌ Dados que só pai e filho usam (use props)
 * ❌ Dados que mudam MUITO rápido (causa re-render de tudo)
 *
 * Comparação: Hook isolado vs. Context
 * ─────────────────────────────────────
 *
 * SEM CONTEXT (hook isolado — usado em useTasks/useProfile):
 * ──────────────────────────────────────────────────────────
 * ```tsx
 * // HomeScreen.tsx
 * const { tasks } = useTasks();  // Estado A
 *
 * // FormScreen.tsx
 * const { tasks } = useTasks();  // Estado B (DIFERENTE de A!)
 * ```
 * Cada tela tem sua PRÓPRIA cópia do estado.
 * Por isso usamos `useFocusEffect` para recarregar ao navegar!
 *
 * COM CONTEXT (estado global — usado neste arquivo):
 * ──────────────────────────────────────────────────
 * ```tsx
 * // App envolto em <AuthProvider>
 * <AuthProvider>
 *   <HomeScreen />  ← ambos acessam o MESMO `user`
 *   <ProfileScreen />
 * </AuthProvider>
 *
 * // HomeScreen.tsx
 * const { user } = useAuthContext();  // Estado compartilhado
 *
 * // ProfileScreen.tsx
 * const { user } = useAuthContext();  // MESMO estado!
 * ```
 *
 * Por que autenticação usa Context e tasks/profile não?
 * ──────────────────────────────────────────────────────
 * - **Autenticação**: TODAS as telas precisam saber se o usuário está logado
 *   (para redirecionar, mostrar/ocultar botões, etc.). Estado global faz sentido.
 *
 * - **Tasks/Profile**: apenas telas ESPECÍFICAS precisam desses dados. Não há
 *   necessidade de poluir o estado global. Além disso, o `useFocusEffect`
 *   garante que os dados sejam recarregados ao navegar, então funciona bem!
 *
 * Como funciona o Context?
 * ────────────────────────
 * 1. `createContext()` → cria o "canal de comunicação"
 * 2. `<AuthProvider>` → componente que FORNECE o valor (state + funções)
 * 3. `useAuthContext()` → hook que CONSOME o valor em qualquer componente filho
 *
 * Fluxo neste projeto:
 * ────────────────────
 * app/_layout.tsx:
 *   <AuthProvider>          ← FORNECE user, signIn, signOut, etc.
 *     <Stack>
 *       <Screen name="login" />    ← CONSOME via useAuthContext()
 *       <Screen name="index" />    ← CONSOME via useAuthContext()
 *       <Screen name="profile" />  ← CONSOME via useAuthContext()
 *     </Stack>
 *   </AuthProvider>
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthContextType } from '../types/auth';

/**
 * Cria o contexto de autenticação.
 *
 * `createContext<AuthContextType | undefined>(undefined)`:
 * ─────────────────────────────────────────────────────────
 * - `AuthContextType` = interface com user, signIn, signOut, etc.
 * - `| undefined` = o contexto PODE ser undefined se usado fora do Provider
 * - `undefined` = valor INICIAL antes do Provider ser montado
 *
 * Por que permitir `undefined`?
 * ─────────────────────────────
 * Se um componente chamar `useAuthContext()` FORA de um `<AuthProvider>`,
 * o valor será `undefined`. Detectamos isso e lançamos um erro amigável.
 *
 * Alternativa (não recomendada):
 * ───────────────────────────────
 * Poderíamos fornecer um valor "fake" inicial:
 * ```ts
 * createContext({ user: null, loading: true, ... })
 * ```
 * Mas isso oculta o erro de uso incorreto. É melhor falhar explicitamente!
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props do componente AuthProvider.
 *
 * `children`: componentes filhos que terão acesso ao contexto.
 * No nosso caso, será o `<Stack>` inteiro da navegação.
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Componente Provider que envolve a árvore de componentes.
 *
 * Este componente:
 * 1. Chama o hook `useAuth()` (que contém toda a lógica de autenticação)
 * 2. Fornece o retorno do hook via `<AuthContext.Provider value={...}>`
 * 3. Renderiza os filhos (children) dentro do Provider
 *
 * Resultado:
 * ──────────
 * Qualquer componente descendente pode chamar `useAuthContext()` e acessar
 * `user`, `signIn`, `signOut`, etc. — SEM precisar receber via props!
 *
 * @param children - Componentes que terão acesso ao contexto de autenticação
 *
 * @example
 * ```tsx
 * // app/_layout.tsx
 * export default function RootLayout() {
 *   return (
 *     <AuthProvider>
 *       <Stack>
 *         <Stack.Screen name="login" />
 *         <Stack.Screen name="index" />
 *       </Stack>
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
export function AuthProvider({ children }: AuthProviderProps) {
  /**
   * Chama o hook useAuth para obter o estado e operações de autenticação.
   *
   * Este hook roda UMA ÚNICA VEZ no Provider (que fica no topo da árvore).
   * Assim, temos um ÚNICO `onAuthStateChanged` ativo, um ÚNICO estado `user`,
   * e TODAS as telas acessam o mesmo valor.
   *
   * Se cada tela chamasse `useAuth()` diretamente, teríamos múltiplos
   * `onAuthStateChanged` rodando (ineficiente) e estados separados (incorreto).
   */
  const auth = useAuth();

  /**
   * Fornece o valor do contexto para os componentes filhos.
   *
   * `value={auth}`:
   * ───────────────
   * Todo o retorno do hook `useAuth` é passado como valor do contexto.
   * Isso inclui: { user, loading, signIn, signUp, signInWithGoogle, signOut }
   *
   * Qualquer componente filho que chamar `useAuthContext()` receberá este objeto.
   *
   * Re-renders:
   * ───────────
   * Quando `user` ou `loading` mudam, o Provider re-renderiza.
   * TODOS os componentes consumidores (`useAuthContext()`) também re-renderizam.
   *
   * Isso é aceitável? SIM, porque mudanças em `user` são RARAS:
   * - Login: 1 re-render
   * - Logout: 1 re-render
   * - App reinicia com token: 1 re-render inicial
   *
   * Se o contexto mudasse 60 vezes por segundo, seria um problema de performance.
   * Mas autenticação muda apenas algumas vezes por SESSÃO — totalmente OK!
   */
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * Hook customizado para acessar o contexto de autenticação.
 *
 * Este é o hook que as telas/componentes chamarão para obter `user`, `signIn`, etc.
 *
 * Por que criar este hook em vez de usar `useContext(AuthContext)` diretamente?
 * ──────────────────────────────────────────────────────────────────────────────
 * 1. **Validação automática**: se alguém chamar fora do `<AuthProvider>`,
 *    lançamos um erro claro em vez de retornar `undefined` (que causaria
 *    crashes difíceis de debugar).
 *
 * 2. **Melhor autocomplete**: o TypeScript já sabe que o retorno NÃO é `undefined`,
 *    então não precisamos checar `if (context)` toda vez.
 *
 * 3. **Encapsulamento**: escondemos o detalhe de que estamos usando Context.
 *    Se no futuro migrarmos para Redux/Zustand, só mudamos este arquivo!
 *
 * @returns Estado e operações de autenticação
 * @throws {Error} Se chamado fora de um <AuthProvider>
 *
 * @example
 * ```tsx
 * function LoginScreen() {
 *   const { user, signIn } = useAuthContext();
 *
 *   if (user) {
 *     return <Text>Já logado como {user.email}</Text>;
 *   }
 *
 *   return <Button onPress={() => signIn('email', 'senha')} />;
 * }
 * ```
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  /**
   * Verifica se o hook está sendo usado dentro de um <AuthProvider>.
   *
   * Se `context === undefined`, significa que:
   * - O componente NÃO está dentro de um `<AuthProvider>`, OU
   * - Esquecemos de adicionar o `<AuthProvider>` no _layout.tsx
   *
   * Lançamos um erro com uma mensagem clara para facilitar o debug.
   */
  if (context === undefined) {
    throw new Error(
      'useAuthContext deve ser usado dentro de um <AuthProvider>. ' +
        'Verifique se o componente está envolvido pelo AuthProvider no _layout.tsx.',
    );
  }

  return context;
}

/**
 * Exportação padrão: o Provider.
 *
 * Permite importar assim:
 * ```tsx
 * import AuthProvider from '@/contexts/AuthContext';
 * ```
 *
 * Mas também mantemos a exportação nomeada para quem preferir:
 * ```tsx
 * import { AuthProvider } from '@/contexts/AuthContext';
 * ```
 */
export default AuthProvider;
