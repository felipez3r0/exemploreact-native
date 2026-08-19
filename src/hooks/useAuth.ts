/**
 * src/hooks/useAuth.ts — Hook Customizado de Autenticação
 *
 * Este hook encapsula TODA a lógica de autenticação do aplicativo usando
 * o Firebase Authentication. Segue o mesmo padrão arquitetural dos hooks
 * `useTasks` e `useProfile`: separar lógica de negócio da UI.
 *
 * Comparação com hooks existentes:
 * ─────────────────────────────────
 * | Hook         | Fonte de dados        | Operações                  |
 * |--------------|----------------------|----------------------------|
 * | useTasks     | SQLite local         | CRUD de tarefas            |
 * | useProfile   | SQLite local         | Salvar/carregar perfil     |
 * | useAuth      | Firebase (nuvem)     | Login, cadastro, logout    |
 *
 * Todos seguem o padrão:
 * - useState para armazenar dados
 * - useEffect/useCallback para operações assíncronas
 * - Retornam uma interface tipada com estado + funções
 *
 * Diferenças deste hook:
 * ──────────────────────
 * 1. **Observador de estado**: `onAuthStateChanged` é um listener que dispara
 *    automaticamente quando o usuário faz login/logout. Isso é diferente de
 *    `useFocusEffect`, que dispara ao navegar para uma tela.
 *
 * 2. **Integração OAuth**: a função `signInWithGoogle` usa `expo-auth-session`
 *    para abrir o browser, fazer login no Google, e trocar o código por um
 *    token Firebase.
 *
 * 3. **Sem repositório**: não há camada intermediária. O hook chama o Firebase
 *    diretamente. Por quê? Porque não há lógica SQL a abstrair — toda a
 *    complexidade está no próprio Firebase SDK.
 *
 * onAuthStateChanged — O Coração da Autenticação:
 * ────────────────────────────────────────────────
 * É um OBSERVADOR (observer pattern) que monitora mudanças no estado de auth:
 * - Login → dispara com o objeto `User`
 * - Logout → dispara com `null`
 * - App reinicia e token válido existe → dispara com `User` restaurado
 *
 * Este listener é registrado UMA VEZ quando o componente que usa o hook monta.
 * Ele fica "escutando" até o componente desmontar (cleanup do useEffect).
 *
 * Fluxo de autenticação:
 * ──────────────────────
 * 1. App inicia → `useAuth` é chamado
 * 2. `useEffect` registra `onAuthStateChanged`
 * 3. Firebase verifica se há token no AsyncStorage
 * 4. Se sim → dispara listener com `User` → `setUser(user)` → `setLoading(false)`
 * 5. Se não → dispara listener com `null` → `setUser(null)` → `setLoading(false)`
 * 6. Componente renderiza com `loading: false` e `user` correto
 */

import { useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  type User,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../services/firebaseConfig';
import { AuthUser, UseAuthReturn } from '../types/auth';

/**
 * Configura o WebBrowser para fechar automaticamente após autenticação.
 *
 * O `expo-auth-session` abre um browser nativo (Safari no iOS, Chrome no Android)
 * para o login do Google. Após o usuário autorizar, o browser precisa fechar e
 * retornar ao app com o código de autorização.
 *
 * `maybeCompleteAuthSession()` configura esse comportamento de retorno.
 * Sem esta linha, o browser ficaria aberto após o login!
 */
WebBrowser.maybeCompleteAuthSession();

/**
 * Hook customizado para autenticação com Firebase.
 *
 * Expõe o estado do usuário autenticado e funções para login, cadastro,
 * Google Sign-In e logout.
 *
 * @returns {UseAuthReturn} Estado e operações de autenticação
 *
 * @example
 * ```tsx
 * function LoginScreen() {
 *   const { user, loading, signIn, signInWithGoogle } = useAuth();
 *
 *   if (loading) return <ActivityIndicator />;
 *   if (user) return <Text>Logado como {user.email}</Text>;
 *
 *   return (
 *     <>
 *       <Button onPress={() => signIn('email@exemplo.com', 'senha123')} />
 *       <Button onPress={signInWithGoogle} title="Entrar com Google" />
 *     </>
 *   );
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  // ─────────────────────────────────────────────────────────────────
  // ESTADO LOCAL
  // ─────────────────────────────────────────────────────────────────

  /**
   * Usuário autenticado ou null se não houver sessão.
   *
   * Inicialmente `null` até o `onAuthStateChanged` verificar se há
   * um token salvo no AsyncStorage.
   */
  const [user, setUser] = useState<AuthUser | null>(null);

  /**
   * Indica se o estado de autenticação ainda está sendo verificado.
   *
   * `true` apenas no carregamento INICIAL do app, enquanto o Firebase
   * verifica se há um token persistido. Depois disso, fica `false`.
   *
   * Por que não usar `loading` nas operações de login/cadastro?
   * ────────────────────────────────────────────────────────────
   * Poderíamos ter um `operationLoading` separado para desabilitar o botão
   * durante o login. Mas mantemos simples: deixamos a UI tratar isso
   * localmente (com um `useState` na própria tela). Este `loading` é apenas
   * para o estado INICIAL.
   */
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────────────────────────────
  // GOOGLE SIGN-IN (expo-auth-session)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Configuração do Google OAuth usando expo-auth-session.
   *
   * `Google.useAuthRequest`:
   * ────────────────────────
   * Hook do expo-auth-session que gerencia o fluxo OAuth 2.0 com o Google.
   * Retorna:
   * - `request`: objeto de configuração da requisição OAuth
   * - `response`: resposta após o usuário autorizar (contém o código ou token)
   * - `promptAsync`: função para abrir o browser e iniciar o fluxo
   *
   * Parâmetros:
   * ───────────
   * - `webClientId`: ID do cliente OAuth Web criado no Google Cloud Console.
   *   Este é o ÚNICO ID necessário para Expo Go. Em builds standalone (EAS),
   *   você também precisaria de `iosClientId` e `androidClientId`.
   *
   * Por que Web Client ID no Expo Go?
   * ──────────────────────────────────
   * O Expo Go não compila código nativo — ele é um "container" JavaScript.
   * Por isso, o fluxo OAuth acontece no BROWSER (como em um app web), e
   * precisamos do Web Client ID.
   *
   * Em produção (EAS Build), o app é compilado nativamente, e o Google SDK
   * nativo é usado → neste caso, precisamos dos Client IDs específicos de
   * cada plataforma (iOS/Android).
   */
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    // Para builds de produção (EAS), adicione:
    // iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    // androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  /**
   * Efeito que processa a resposta do Google OAuth.
   *
   * Fluxo do Google Sign-In:
   * ────────────────────────
   * 1. Usuário clica "Entrar com Google"
   * 2. `promptAsync()` abre o browser com a tela de login do Google
   * 3. Usuário autoriza o app
   * 4. Google redireciona de volta para o app com um código/token
   * 5. Este useEffect detecta a mudança em `response`
   * 6. Extraímos o `id_token` da resposta
   * 7. Criamos uma credencial Firebase com o `id_token`
   * 8. Fazemos login no Firebase com essa credencial
   * 9. `onAuthStateChanged` dispara e atualiza o estado `user`
   *
   * Por que `response?.type === 'success'`?
   * ───────────────────────────────────────
   * O usuário pode CANCELAR o login (fechando o browser sem autorizar).
   * Neste caso, `response.type` será `'cancel'` ou `'dismiss'`, e não devemos
   * tentar fazer login.
   */
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      // Cria uma credencial do Google usando o id_token recebido
      const credential = GoogleAuthProvider.credential(id_token);

      // Faz login no Firebase usando a credencial do Google
      signInWithCredential(auth, credential).catch((error: any) => {
        console.error('Erro ao fazer login com Google:', error);
        alert('Erro ao fazer login com Google. Tente novamente.');
      });

      // Nota: não precisamos chamar setUser aqui — o `onAuthStateChanged`
      // no useEffect abaixo será disparado automaticamente quando o login
      // no Firebase for bem-sucedido, atualizando o estado `user`.
    }
  }, [response]);

  // ─────────────────────────────────────────────────────────────────
  // OBSERVADOR DE ESTADO DE AUTENTICAÇÃO
  // ─────────────────────────────────────────────────────────────────

  /**
   * Registra o listener de mudanças no estado de autenticação.
   *
   * `onAuthStateChanged`:
   * ─────────────────────
   * Função do Firebase que recebe um callback. Esse callback é chamado:
   * - Imediatamente ao registrar o listener (com o estado atual)
   * - Sempre que o usuário faz login
   * - Sempre que o usuário faz logout
   * - Quando o token expira e é renovado
   *
   * Retorna uma função de CLEANUP que desregistra o listener.
   * O useEffect cuida de chamar essa função quando o componente desmonta.
   *
   * Mapeamento do objeto User do Firebase:
   * ───────────────────────────────────────
   * O Firebase retorna um objeto `User` com 30+ propriedades. Extraímos
   * apenas as que usamos na UI e criamos nosso próprio objeto `AuthUser`.
   *
   * Por que não usar o `User` do Firebase diretamente?
   * ───────────────────────────────────────────────────
   * - Simplicidade: nossa interface `AuthUser` tem apenas 4 campos
   * - Desacoplamento: se mudarmos de Firebase para outro provedor (ex: Supabase),
   *   só precisamos mudar este hook — os componentes continuam usando `AuthUser`
   * - Type safety: TypeScript garante que só acessamos campos que existem
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        if (firebaseUser) {
          // Usuário está autenticado — mapeamos para nosso tipo
          const mappedUser: AuthUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };
          setUser(mappedUser);
        } else {
          // Usuário não está autenticado
          setUser(null);
        }
        setLoading(false); // Verificação inicial concluída
      },
    );

    // Cleanup: remove o listener quando o componente desmonta
    return unsubscribe;
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // OPERAÇÕES DE AUTENTICAÇÃO
  // ─────────────────────────────────────────────────────────────────

  /**
   * Faz login com email e senha.
   *
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @throws {Error} Se as credenciais estiverem incorretas ou houver erro de rede
   *
   * Erros comuns do Firebase:
   * ─────────────────────────
   * - `auth/user-not-found`: email não cadastrado
   * - `auth/wrong-password`: senha incorreta
   * - `auth/invalid-email`: formato de email inválido
   * - `auth/too-many-requests`: muitas tentativas falhadas (conta temporariamente bloqueada)
   *
   * Nota: o `onAuthStateChanged` será disparado automaticamente após o login
   * bem-sucedido, atualizando o estado `user`. Por isso, esta função não
   * precisa chamar `setUser` manualmente.
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await firebaseSignIn(auth, email, password);
      // Sucesso! O onAuthStateChanged atualizará o estado automaticamente
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      // Traduz o código de erro do Firebase para mensagem amigável
      const message = getErrorMessage(error.code);
      throw new Error(message);
    }
  }, []);

  /**
   * Cria uma nova conta com email e senha.
   *
   * @param email - Email do usuário
   * @param password - Senha (mínimo 6 caracteres)
   * @throws {Error} Se o email já estiver em uso ou a senha for fraca
   *
   * Comportamento do Firebase:
   * ──────────────────────────
   * Após criar a conta, o Firebase automaticamente FAZ LOGIN com ela.
   * Portanto, após `createUserWithEmailAndPassword`, o `onAuthStateChanged`
   * é disparado com o novo usuário — não é necessário chamar `signIn`.
   *
   * Erros comuns:
   * ─────────────
   * - `auth/email-already-in-use`: email já cadastrado
   * - `auth/weak-password`: senha com menos de 6 caracteres
   * - `auth/invalid-email`: formato de email inválido
   */
  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await firebaseSignUp(auth, email, password);
      // Sucesso! Firebase já faz login automaticamente + onAuthStateChanged atualiza estado
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      const message = getErrorMessage(error.code);
      throw new Error(message);
    }
  }, []);

  /**
   * Inicia o fluxo de login com Google.
   *
   * Esta função:
   * 1. Verifica se a configuração OAuth está pronta (`request`)
   * 2. Chama `promptAsync()` para abrir o browser de autenticação
   * 3. O useEffect acima processa a resposta e faz login no Firebase
   *
   * Por que `useCallback`?
   * ──────────────────────
   * Esta função é passada para componentes filhos como prop (`onPress`).
   * Sem `useCallback`, seria recriada a cada render, causando re-renders
   * desnecessários dos componentes que a recebem.
   *
   * Dependências: `[promptAsync]`
   * ──────────────────────────────
   * `promptAsync` vem do hook `Google.useAuthRequest`, que recria a função
   * quando a configuração muda. Incluímos como dependência para garantir
   * que sempre usamos a versão mais recente.
   */
  const signInWithGoogle = useCallback(async () => {
    if (!request) {
      alert('Configuração do Google ainda não está pronta. Aguarde...');
      return;
    }
    await promptAsync();
  }, [request, promptAsync]);

  /**
   * Faz logout, limpando a sessão do Firebase.
   *
   * Comportamento:
   * ──────────────
   * 1. Remove o token do AsyncStorage
   * 2. Dispara `onAuthStateChanged` com `null`
   * 3. O useEffect atualiza `user` para `null`
   * 4. A UI detecta `user === null` e redireciona para /login
   *
   * ⚠️ IMPORTANTE: em produção, considere limpar dados sensíveis do app
   * (ex: cache de imagens, dados temporários) durante o logout.
   */
  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      // Sucesso! O onAuthStateChanged atualizará o estado para null
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao sair. Tente novamente.');
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────
  // RETORNO DO HOOK
  // ─────────────────────────────────────────────────────────────────

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
}

// ═════════════════════════════════════════════════════════════════
// UTILITÁRIOS
// ═════════════════════════════════════════════════════════════════

/**
 * Traduz códigos de erro do Firebase para mensagens amigáveis em português.
 *
 * O Firebase retorna erros em inglês com códigos como `auth/user-not-found`.
 * Esta função mapeia os códigos mais comuns para mensagens que o usuário
 * final consegue entender.
 *
 * @param code - Código de erro do Firebase (ex: 'auth/wrong-password')
 * @returns Mensagem traduzida para o português
 */
function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/user-not-found': 'Email não cadastrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/email-already-in-use': 'Este email já está em uso.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/invalid-email': 'Email inválido.',
    'auth/too-many-requests':
      'Muitas tentativas. Tente novamente mais tarde ou redefina sua senha.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  };

  return messages[code] || 'Erro ao processar sua solicitação.';
}
