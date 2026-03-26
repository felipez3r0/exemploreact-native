/**
 * app/profile.tsx — Tela de Perfil do Usuário
 *
 * Tela que permite ao usuário:
 * - Informar nome e email
 * - Capturar uma foto com a câmera do dispositivo
 * - Salvar os dados no SQLite (registro único)
 *
 * Diferenças em relação a form.tsx (tarefas):
 * ─────────────────────────────────────────────
 * | Aspecto            | form.tsx                | profile.tsx              |
 * |--------------------|-------------------------|--------------------------|
 * | Modo de operação   | Criar OU editar (com id)| Sempre edição (id=1 fixo)|
 * | Estado inicial     | Vazio ou carregado      | Carregado do banco ou {} |
 * | Validação          | Título obrigatório      | Campos opcionais         |
 * | Captura de mídia   | Não                     | Sim (câmera)             |
 * | Arquivo persistente| Não                     | Sim (expo-file-system)   |
 *
 * Conceito de URI temporário vs. permanente:
 * ───────────────────────────────────────────
 * Quando capturamos uma foto com `expo-camera`, o arquivo fica em um
 * diretório temporário (cache) e pode ser deletado pelo sistema a qualquer
 * momento (ex: limpeza automática de espaço).
 *
 * Para fazer a foto sobreviver ao fechamento do app e limpezas do sistema,
 * **COPIAMOS o arquivo** para `Paths.document`, que é o
 * armazenamento permanente dedicado ao app.
 *
 * Fluxo de captura de foto:
 * ─────────────────────────
 * 1. Usuário toca na área da foto → `showCamera = true`
 * 2. `<CameraCapture>` é renderizado como overlay absoluto
 * 3. Usuário captura → `onCapture(tempUri)` é chamado com URI temporário
 * 4. Copiamos o arquivo: `new File(tempUri).copy(destFile)`
 * 5. Salvamos `destFile.uri` no estado e depois no banco
 * 6. `showCamera = false` → volta para o formulário
 *
 * Componentes React Native usados:
 * ─────────────────────────────────
 * - `KeyboardAvoidingView`: ajusta layout quando teclado sobe
 * - `ScrollView`: permite rolar quando conteúdo não cabe na tela
 * - `Image`: exibe a foto capturada
 * - `TouchableOpacity`: área tocável (botão)
 * - `TextInput`: campos de nome e email
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { File, Paths } from 'expo-file-system';

import { useProfile } from '../src/hooks/useProfile';
import { CameraCapture } from '../src/components/CameraCapture';

/**
 * Tela de perfil do usuário com captura de foto.
 */
export default function ProfileScreen() {
  const router = useRouter();

  // Hook customizado que gerencia o estado do perfil no banco de dados
  const { profile, loading, saveProfile } = useProfile();

  // ─────────────────────────────────────────────────────────────────────────
  // ESTADOS LOCAIS DO FORMULÁRIO
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Estados controlados para os campos do formulário.
   * Começam vazios e são preenchidos pelo `useEffect` quando o perfil carrega.
   */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  /**
   * Controla se a câmera está sendo exibida.
   * Quando `true`, `<CameraCapture>` é renderizado como overlay.
   */
  const [showCamera, setShowCamera] = useState(false);

  /** Indica que estamos salvando no banco (feedback visual no botão) */
  const [saving, setSaving] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  // EFEITOS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Preenche os campos do formulário quando o perfil é carregado do banco.
   *
   * O hook `useProfile` carrega o perfil automaticamente ao montar/focar.
   * Este efeito sincroniza os dados carregados com os estados locais.
   *
   * Por que não usar o `profile` direto sem estados locais?
   * - Porque `TextInput` trabalha melhor com `useState` (controlled components)
   * - Precisamos de um "rascunho" editável antes de salvar no banco
   * - Evita salvar a cada tecla digitada (só salvamos ao clicar no botão)
   */
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhotoUri(profile.photoUri);
    }
  }, [profile]); // Re-executa quando `profile` muda (após carregar ou salvar)

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS DE CAPTURA DE FOTO
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Processa a foto capturada pela câmera.
   *
   * O que este handler faz:
   * 1. Recebe o URI temporário da foto (ex: "file:///cache/Camera/photo-123.jpg")
   * 2. Cria um nome único para o arquivo permanente usando timestamp
   * 3. Copia o arquivo do cache para `FileSystem.documentDirectory` (permanente)
   * 4. Atualiza o estado local com o URI permanente
   * 5. Fecha a câmera
   *
   * Por que usar timestamp no nome do arquivo?
   * - Garante unicidade (cada foto tem nome diferente)
   * - Previne conflitos se o usuário tirar múltiplas fotos
   * - Formato: profile-1679832120450.jpg (Unix timestamp em milissegundos)
   *
   * Por que usar `file.copy()` em vez da API legada?
   * - A nova API é orientada a objetos e mais intuitiva
   * - Não requer `await` — operação síncrona e performática
   * - `Paths.document` substitui o antigo `FileSystem.documentDirectory`
   *
   * @param tempUri URI temporário da foto capturada (diretório cache/temporário)
   */
  const handlePhotoCapture = async (tempUri: string) => {
    try {
      // Gera um nome único usando timestamp (milissegundos desde 1970)
      const fileName = `profile-${Date.now()}.jpg`;

      /**
       * `Paths.document` é o diretório permanente do app.
       * iOS: /var/mobile/Containers/Data/Application/<UUID>/Documents/
       * Android: /data/user/0/<package>/files/
       *
       * Os arquivos aqui sobrevivem até o app ser desinstalado.
       * NÃO são deletados por limpezas automáticas do sistema.
       */
      const destFile = new File(Paths.document, fileName);

      // Copia o arquivo do cache temporário para o diretório permanente
      new File(tempUri).copy(destFile);

      // Atualiza o estado local com o URI permanente
      setPhotoUri(destFile.uri);

      // Fecha a câmera
      setShowCamera(false);
    } catch (error) {
      console.error('Erro ao copiar foto:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar a foto. Por favor, tente novamente.',
      );
    }
  };

  /**
   * Abre a câmera para capturar uma nova foto.
   */
  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  /**
   * Fecha a câmera sem capturar foto.
   */
  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // HANDLER DE SALVAR
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Salva o perfil no banco de dados (cria ou atualiza).
   *
   * Diferente de tasks, os campos do perfil NÃO são obrigatórios.
   * O usuário pode salvar um perfil vazio se quiser — isso é aceitável
   * para dados de perfil (diferente de título de tarefa, que é essencial).
   *
   * Validações possíveis (não implementadas aqui, mas sugeridas):
   * - Validar formato do email com regex
   * - Limitar tamanho máximo do nome
   * - Confirmar antes de sobrescrever foto existente
   */
  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProfile({
        name: name.trim(), // Remove espaços em branco do início/fim
        email: email.trim(),
        photoUri, // Pode ser null se não tiver foto
      });

      // Exibe confirmação de sucesso
      Alert.alert('Sucesso', 'Perfil salvo com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert(
        'Erro',
        'Não foi possível salvar o perfil. Por favor, tente novamente.',
      );
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // ESTADO DE CARREGAMENTO
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Enquanto buscamos o perfil do banco, exibimos um spinner.
   * Isso evita o "flash" de um formulário vazio antes de preencher os dados.
   */
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-3 text-gray-500 text-sm">Carregando perfil...</Text>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDERIZAÇÃO DO FORMULÁRIO
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FORMULÁRIO PRINCIPAL                                            */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-gray-50"
      >
        <ScrollView
          className="flex-1"
          /**
           * IMPORTANTE: `contentContainerClassName` (não `className`!)
           * ScrollView tem duas áreas de estilo:
           * - `className`: aplica ao container que rola
           * - `contentContainerClassName`: aplica ao conteÚDO dentro
           *
           * Aqui usamos `contentContainerClassName` para que o padding
           * seja aplicado ao conteúdo que rola, não ao scroll em si.
           */
          contentContainerClassName="px-4 pt-6 pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── ÁREA DE FOTO ───────────────────────────────────────── */}
          <View className="items-center mb-8">
            <TouchableOpacity
              onPress={handleOpenCamera}
              className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center overflow-hidden border-4 border-white shadow-lg"
              activeOpacity={0.7}
            >
              {photoUri ? (
                /**
                 * Exibe a foto capturada.
                 * `source={{ uri }}` aceita URIs de arquivo locais:
                 * - file:///data/.../profile-123.jpg (Android)
                 * - file:///var/.../profile-123.jpg (iOS)
                 */
                <Image
                  source={{ uri: photoUri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                /**
                 * Placeholder quando não há foto:
                 * Ícone de câmera + texto instruindo o usuário.
                 */
                <View className="items-center">
                  <Text className="text-5xl mb-1">📷</Text>
                  <Text className="text-xs text-gray-500 text-center px-2">
                    Adicionar{'\n'}Foto
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Texto de instrução abaixo da foto */}
            <Text className="text-xs text-gray-400 mt-2 text-center">
              Toque para {photoUri ? 'alterar' : 'capturar'} sua foto
            </Text>
          </View>

          {/* ── CAMPO DE NOME ──────────────────────────────────────── */}
          <View className="mb-5">
            <Text className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
              Nome
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              placeholderTextColor="#9ca3af"
              className="bg-white rounded-xl px-4 py-3 text-base text-gray-800 border border-gray-200"
              maxLength={100}
              returnKeyType="next"
              autoCapitalize="words" // Capitaliza primeira letra de cada palavra
            />
          </View>

          {/* ── CAMPO DE EMAIL ─────────────────────────────────────── */}
          <View className="mb-8">
            <Text className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu.email@exemplo.com"
              placeholderTextColor="#9ca3af"
              className="bg-white rounded-xl px-4 py-3 text-base text-gray-800 border border-gray-200"
              maxLength={100}
              keyboardType="email-address" // Teclado otimizado para email
              autoCapitalize="none" // Não capitaliza (emails são lowercase)
              autoCorrect={false} // Desliga autocorreção (emails não são palavras)
              returnKeyType="done"
            />
          </View>

          {/* ── BOTÃO DE SALVAR ────────────────────────────────────── */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className={`rounded-xl py-4 items-center ${
              saving ? 'bg-indigo-300' : 'bg-indigo-600'
            }`}
            accessibilityRole="button"
            accessibilityLabel="Salvar perfil"
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-base">
                💾 Salvar Perfil
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* OVERLAY DE CÂMERA (renderizado condicionalmente)                */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/**
       * Renderização condicional: só exibe CameraCapture quando showCamera=true.
       * `<CameraCapture>` usa StyleSheet.absoluteFillObject, então aparece
       * SOBRE todo o resto da tela como um modal fullscreen.
       */}
      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={handleCloseCamera}
        />
      )}
    </>
  );
}
