/**
 * app/login.tsx — Tela de Login
 *
 * Esta tela permite que o usuário faça login de duas formas:
 * 1. Email e senha (Firebase Email/Password Authentication)
 * 2. Conta do Google (Firebase Google Sign-In via OAuth)
 *
 * Padrão arquitetural:
 * ────────────────────
 * Esta tela é um componente "inteligente" (smart component):
 * - Gerencia estado LOCAL da UI (campos email/senha, loading)
 * - Consome estado GLOBAL via `useAuthContext()` (user, signIn, signInWithGoogle)
 * - Delega a lógica de autenticação para o contexto (não chama Firebase diretamente)
 *
 * Comparação com outras telas do projeto:
 * ────────────────────────────────────────
 * | Tela         | Estado local      | Hook/Context usado   | Lógica de dados    |
 * |--------------|-------------------|----------------------|--------------------|
 * | index.tsx    | Nenhum            | useTasks()           | Repository         |
 * | form.tsx     | email, senha      | TaskRepository.*     | SQL                |
 * | profile.tsx  | nome, email, foto | useProfile()         | Repository         |
 * | login.tsx    | email, senha      | useAuthContext()     | Firebase (nuvem)   |
 *
 * Fluxo de autenticação:
 * ──────────────────────
 * 1. Usuário digita email e senha → armazenados em `useState` locais
 * 2. Clica "Entrar" → chama `handleLogin()`
 * 3. `handleLogin()` chama `signIn(email, senha)` do contexto
 * 4. Se sucesso → `onAuthStateChanged` atualiza `user` no contexto
 * 5. `_layout.tsx` detecta `user !== null` → redireciona para "/"
 * 6. Tela de login desmonta → campos de input são limpos
 *
 * Por que não usar `router.push('/')` após login?
 * ────────────────────────────────────────────────
 * A lógica de redirecionamento está no `_layout.tsx` (proteção de rotas).
 * Isso centraliza o controle de navegação baseado em autenticação em UM único lugar.
 * Se cada tela fizesse seu próprio redirect, teríamos lógica duplicada e bugs.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../src/contexts/AuthContext';

/**
 * Componente da tela de login.
 *
 * Renderiza:
 * - Campos de email e senha
 * - Botão de login com email/senha
 * - Botão de login com Google
 * - Link para a tela de cadastro
 * - Indicadores de loading
 */
export default function LoginScreen() {
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    signIn,
    signInWithGoogle,
  } = useAuthContext();

  // ─────────────────────────────────────────────────────────────────
  // ESTADO LOCAL DA UI
  // ─────────────────────────────────────────────────────────────────

  /**
   * Campos do formulário.
   * Usamos `useState` local porque esses valores são específicos desta tela
   * e não precisam ser compartilhados com outros componentes.
   */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Indica se uma operação de login está em andamento.
   *
   * Diferente de `authLoading` (que é apenas para o estado inicial do app),
   * este `loading` controla o estado do BOTÃO de login:
   * - true → botão desabilitado + spinner
   * - false → botão habilitado
   */
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────────────────────────────
  // OPERAÇÕES DE LOGIN
  // ─────────────────────────────────────────────────────────────────

  /**
   * Faz login com email e senha.
   *
   * Validações:
   * ───────────
   * - Campos não podem estar vazios
   * - Email deve ter formato válido (o Firebase valida isso)
   * - Senha deve ter pelo menos 6 caracteres (o Firebase valida isso)
   *
   * Tratamento de erros:
   * ────────────────────
   * O hook `useAuth` já traduz os erros do Firebase para mensagens em português.
   * Aqui apenas capturamos a exceção e exibimos um Alert.
   */
  const handleLogin = async () => {
    // Validação básica
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha email e senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
      // Sucesso! O `_layout.tsx` redirecionará automaticamente para "/"
    } catch (error: any) {
      // Exibe o erro traduzido do Firebase
      Alert.alert('Erro ao fazer login', error.message || 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inicia o fluxo de login com Google.
   *
   * Esta função:
   * 1. Chama `signInWithGoogle()` do contexto
   * 2. O hook `useAuth` abre o browser de autenticação (expo-auth-session)
   * 3. Usuário autoriza o app
   * 4. O hook processa a resposta e faz login no Firebase
   * 5. `onAuthStateChanged` atualiza o estado `user`
   * 6. `_layout.tsx` redireciona para "/"
   *
   * Erro comum:
   * ───────────
   * Se o EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID não estiver configurado no .env,
   * ou estiver incorreto, o login com Google falhará. O erro aparecerá no
   * console do terminal (não em um Alert).
   */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      // O fluxo OAuth é assíncrono — o usuário verá o browser abrir
    } catch (error: any) {
      Alert.alert(
        'Erro ao fazer login com Google',
        error.message || 'Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────
  // RENDERIZAÇÃO
  // ─────────────────────────────────────────────────────────────────

  /**
   * Mostra um loading enquanto verifica o estado de autenticação inicial.
   *
   * `authLoading` é `true` apenas na primeira renderização do app, enquanto
   * o Firebase verifica se há um token salvo no AsyncStorage.
   *
   * Por que mostrar loading em vez da tela de login?
   * ─────────────────────────────────────────────────
   * Se o usuário JÁ estiver logado (token válido no AsyncStorage), o
   * `_layout.tsx` redirecionará para "/" assim que `authLoading` virar `false`.
   * Mostrar a tela de login por 1 segundo e depois redirecionar causaria
   * um "flash" visual ruim. O loading evita isso.
   */
  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-4 text-gray-600">Verificando autenticação...</Text>
      </View>
    );
  }

  /**
   * KeyboardAvoidingView para iOS.
   *
   * No iOS, quando o teclado abre, ele pode sobrepor os campos de input.
   * `KeyboardAvoidingView` ajusta automaticamente o layout, empurrando
   * o conteúdo para cima quando o teclado aparece.
   *
   * `behavior="padding"`:
   * ─────────────────────
   * Adiciona padding na parte inferior para "elevar" o conteúdo.
   * Alternativas: "height" (ajusta a altura) ou "position" (ajusta posição).
   * "padding" funciona melhor na maioria dos casos.
   *
   * `Platform.OS === 'ios'`:
   * ────────────────────────
   * No Android, o sistema já ajusta o layout automaticamente (resize mode).
   * Só precisamos do KeyboardAvoidingView no iOS.
   */
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-gray-50 px-6 justify-center">
          {/* Cabeçalho */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-800 mb-2">
              Bem-vindo! 👋
            </Text>
            <Text className="text-base text-gray-600">
              Faça login para acessar suas tarefas
            </Text>
          </View>

          {/* Formulário de Email/Senha */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Senha
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Botão de Login com Email/Senha */}
          <TouchableOpacity
            className={`rounded-xl py-4 mb-4 ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600'
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-center text-base font-semibold">
                Entrar
              </Text>
            )}
          </TouchableOpacity>

          {/* Divisor */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">OU</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Botão de Login com Google */}
          <TouchableOpacity
            className="bg-white border border-gray-300 rounded-xl py-4 mb-6 flex-row items-center justify-center"
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text className="text-2xl mr-3">🔍</Text>
            <Text className="text-gray-800 text-base font-semibold">
              Entrar com Google
            </Text>
          </TouchableOpacity>

          {/* Link para Cadastro */}
          <View className="flex-row items-center justify-center">
            <Text className="text-gray-600 text-sm">Não tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => router.push('/register')}
              disabled={loading}
            >
              <Text className="text-indigo-600 text-sm font-semibold">
                Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
