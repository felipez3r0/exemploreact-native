/**
 * src/types/auth.ts — Definições de Tipos TypeScript para o módulo de Autenticação
 *
 * Este arquivo define as interfaces e tipos usados em todo o sistema de
 * autenticação do aplicativo. Seguindo o mesmo padrão dos arquivos `task.ts`
 * e `profile.ts`, centralizamos aqui os contratos de dados.
 *
 * Por que separar os tipos em um arquivo?
 * ──────────────────────────────────────
 * - ✅ Reutilização: múltiplos arquivos importam os mesmos tipos
 * - ✅ Consistência: um único local para definir a forma dos dados
 * - ✅ Manutenibilidade: mudanças em um tipo afetam todos os usos
 * - ✅ TypeScript: garante segurança de tipos em tempo de compilação
 *
 * Mapeamento do Firebase User:
 * ────────────────────────────
 * O Firebase retorna um objeto `User` com MUITAS propriedades que não usamos.
 * Nossa interface `AuthUser` extrai apenas o que precisamos, mantendo o
 * código limpo e focado.
 */

/**
 * Representa o usuário autenticado no aplicativo.
 *
 * Mapeado do objeto `User` do Firebase Authentication, mas contendo apenas
 * as propriedades que efetivamente usamos na UI.
 *
 * @property uid - Identificador único do usuário no Firebase (imutável)
 * @property email - Email do usuário (pode ser null para login social sem email)
 * @property displayName - Nome de exibição do usuário (pode ser null se não configurado)
 * @property photoURL - URL da foto de perfil (pode ser null se não configurado)
 *
 * Nota: O Firebase retorna `photoURL` (camelCase), não `photoUri`.
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Interface de retorno do hook `useAuth`.
 *
 * Define todas as operações e estados relacionados à autenticação que o
 * hook customizado expõe para os componentes consumidores.
 *
 * Este padrão é consistente com `UseTasksReturn` e `UseProfileReturn` —
 * sempre definimos uma interface para o retorno de hooks customizados.
 *
 * @property user - Usuário autenticado ou null se não houver sessão
 * @property loading - true enquanto verifica o estado de auth inicial
 * @property signIn - Função para login com email/senha
 * @property signUp - Função para cadastro com email/senha
 * @property signInWithGoogle - Função para login com Google (OAuth)
 * @property signOut - Função para logout (limpa sessão)
 */
export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Tipo do contexto de autenticação.
 *
 * O React Context API exige que definamos o tipo do valor fornecido pelo
 * Provider. Como o contexto envolve o hook `useAuth`, ele expõe exatamente
 * as mesmas propriedades.
 *
 * Por que separar `AuthContextType` de `UseAuthReturn`?
 * ──────────────────────────────────────────────────────
 * Tecnicamente poderíamos usar o mesmo tipo, mas semanticamente são conceitos
 * diferentes:
 * - `UseAuthReturn` = contrato do HOOK (lógica isolada)
 * - `AuthContextType` = contrato do CONTEXT (estado global compartilhado)
 *
 * Se no futuro o contexto precisar expor algo além do hook (ex: configurações
 * globais de auth), essa separação facilita a evolução.
 */
export type AuthContextType = UseAuthReturn;
