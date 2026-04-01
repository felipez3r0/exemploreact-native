/**
 * app/register.tsx — Tela de Cadastro
 *
 * Esta tela permite que novos usuários criem uma conta usando email e senha.
 *
 * Por que não incluir cadastro com Google?
 * ────────────────────────────────────────
 * O "Login com Google" JÁ funciona como cadastro! Se o usuário clicar em
 * "Entrar com Google" e não tiver conta, o Firebase cria uma automaticamente.
 * Por isso, esta tela só tem email/senha.
 *
 * Comportamento do Firebase após cadastro:
 * ─────────────────────────────────────────
 * O `createUserWithEmailAndPassword` faz DUAS coisas:
 * 1. Cria a conta no Firebase Authentication
 * 2. Faz login AUTOMATICAMENTE com essa conta
 *
 * Portanto, após o cadastro bem-sucedido:
 * - `onAuthStateChanged` dispara com o novo `User`
 * - `_layout.tsx` detecta `user !== null` e redireciona para "/"
 * - O usuário JÁ entra no app logado — não precisa fazer login novamente!
 *
 * Validações implementadas:
 * ─────────────────────────
 * - Email e senha não podem estar vazios
 * - Senha deve ter pelo menos 6 caracteres (também validado pelo Firebase)
 * - Senha e confirmação devem ser iguais
 *
 * Comparação com a tela de login:
 * ────────────────────────────────
 * | Aspecto          | login.tsx                | register.tsx         |
 * |------------------|--------------------------|----------------------|
 * | Operação         | signIn()                 | signUp()             |
 * | Campos           | email, senha             | email, senha, confirmar |
 * | Botão extra      | Login com Google         | Nenhum               |
 * | Link inferior    | "Cadastre-se"            | "Entrar"             |
 * | Após sucesso     | Redireciona para /       | Redireciona para /   |
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
 * Componente da tela de cadastro.
 *
 * Renderiza:
 * - Campos de email, senha e confirmação de senha
 * - Botão de cadastro
 * - Link para voltar à tela de login
 * - Indicadores de loading
 */
export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, loading: authLoading } = useAuthContext();

  // ─────────────────────────────────────────────────────────────────
  // ESTADO LOCAL DA UI
  // ─────────────────────────────────────────────────────────────────

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ─────────────────────────────────────────────────────────────────
  // OPERAÇÃO DE CADASTRO
  // ─────────────────────────────────────────────────────────────────

  /**
   * Cria uma nova conta com email e senha.
   *
   * Validações antes de chamar o Firebase:
   * ───────────────────────────────────────
   * 1. Campos não podem estar vazios
   * 2. Senha deve ter pelo menos 6 caracteres
   * 3. Senha e confirmação devem ser iguais
   *
   * Por que validar senha >= 6 se o Firebase já valida?
   * ───────────────────────────────────────────────────
   * Para dar feedback IMEDIATO ao usuário, sem fazer uma chamada de rede.
   * É mais rápido e consome menos recursos.
   *
   * Após cadastro bem-sucedido:
   * ───────────────────────────
   * O Firebase automaticamente faz login com a nova conta.
   * O `onAuthStateChanged` detecta isso e atualiza o estado `user`.
   * O `_layout.tsx` redireciona para "/" automaticamente.
   */
  const handleRegister = async () => {
    // Validação de campos vazios
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }

    // Validação de comprimento da senha
    if (password.length < 6) {
      Alert.alert(
        'Senha muito curta',
        'A senha deve ter pelo menos 6 caracteres.',
      );
      return;
    }

    // Validação de confirmação de senha
    if (password !== confirmPassword) {
      Alert.alert(
        'Senhas não coincidem',
        'As senhas digitadas são diferentes.',
      );
      return;
    }

    try {
      setLoading(true);
      await signUp(email.trim(), password);
      // Sucesso! O usuário será logado automaticamente e redirecionado
    } catch (error: any) {
      // Exibe o erro traduzido do Firebase
      Alert.alert('Erro ao criar conta', error.message || 'Tente novamente.');
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
   * Este caso é raro (usuário já logado acessando /register), mas tratamos
   * para consistência. Na prática, o `_layout.tsx` redirecionará usuários
   * autenticados para "/" antes desta tela renderizar.
   */
  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-4 text-gray-600">Verificando autenticação...</Text>
      </View>
    );
  }

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
              Criar conta 🚀
            </Text>
            <Text className="text-base text-gray-600">
              Cadastre-se para começar a organizar suas tarefas
            </Text>
          </View>

          {/* Campo de Email */}
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

          {/* Campo de Senha */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Senha
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Campo de Confirmação de Senha */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Confirmar senha
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Botão de Cadastro */}
          <TouchableOpacity
            className={`rounded-xl py-4 mb-6 ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600'
            }`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-center text-base font-semibold">
                Criar conta
              </Text>
            )}
          </TouchableOpacity>

          {/* Link para Login */}
          <View className="flex-row items-center justify-center">
            <Text className="text-gray-600 text-sm">Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.back()} disabled={loading}>
              <Text className="text-indigo-600 text-sm font-semibold">
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
