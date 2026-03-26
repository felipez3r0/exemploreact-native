/**
 * src/components/CameraCapture.tsx — Componente de Captura de Foto com Câmera
 *
 * Componente que encapsula toda a lógica de acesso à câmera do dispositivo,
 * incluindo solicitação de permissões, preview e captura de foto.
 *
 * O que é expo-camera?
 * ────────────────────
 * É uma biblioteca do Expo que fornece acesso à câmera nativa do dispositivo
 * (iOS e Android) com uma API JavaScript unificada. Funciona no Expo Go e
 * em builds standalone (development/production).
 *
 * Conceitos importantes neste componente:
 * ────────────────────────────────────────
 * 1. PERMISSÕES: O acesso à câmera REQUER permissão explícita do usuário.
 *    O sistema operacional (iOS/Android) exibe um diálogo de permissão.
 *
 * 2. ESTADOS DE PERMISSÃO:
 *    - null/undefined: ainda não solicitamos (inicial)
 *    - denied: usuário negou → devemos orientá-lo a ir nas Configurações
 *    - granted: permissão concedida → podemos acessar a câmera
 *
 * 3. OVERLAY ABSOLUTO: Este componente é renderizado SOBRE a tela de perfil
 *    usando `position: absolute` que cobre toda a tela (StyleSheet.absoluteFillObject).
 *
 * 4. REF: Usamos `useRef<CameraView>` para ter uma referência direta ao
 *    componente CameraView e chamar métodos imperativos como `takePictureAsync()`.
 *
 * Props do componente:
 * ────────────────────
 * - onCapture(uri): callback chamado quando a foto é capturada
 * - onClose(): callback para fechar a câmera sem capturar
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

// =============================================================================
// TIPOS DAS PROPS
// =============================================================================

interface CameraCaptureProps {
  /**
   * Callback chamado quando uma foto é capturada.
   * Recebe o URI local da foto (caminho temporário no dispositivo).
   *
   * IMPORTANTE: este URI é TEMPORÁRIO — o arquivo pode ser deletado pelo
   * sistema a qualquer momento. A tela de perfil deve copiar o arquivo para
   * um local permanente usando `expo-file-system`.
   */
  onCapture: (uri: string) => void;

  /** Callback chamado quando o usuário fecha a câmera sem capturar */
  onClose: () => void;
}

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Componente de captura de foto com gerenciamento de permissões.
 *
 * Fluxo de estados:
 * ─────────────────
 * 1. Verificando permissões (spinner ou tela branca, rápido demais para ver)
 * 2. Permissão negada → tela explicativa com botão para Configurações
 * 3. Permissão concedida → preview da câmera com botão de captura
 *
 * Por que separar em um componente?
 * ─────────────────────────────────
 * ✅ REUTILIZAÇÃO: se outra tela precisar de câmera, basta importar
 * ✅ TESTABILIDADE: podemos testar a lógica de permissões isoladamente
 * ✅ SEPARAÇÃO: lógica complexa não polui a tela de perfil
 */
export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  // ───────────────────────────────────────────────────────────────────────
  // GERENCIAMENTO DE PERMISSÕES
  // ───────────────────────────────────────────────────────────────────────

  /**
   * Hook `useCameraPermissions` do expo-camera.
   *
   * Retorna um array com 2 elementos:
   * [0] permission → objeto com status da permissão
   * [1] requestPermission → função para solicitar permissão
   *
   * Estrutura do objeto `permission`:
   * {
   *   status: 'undetermined' | 'denied' | 'granted',
   *   granted: boolean,  // atalho: true se status === 'granted'
   *   canAskAgain: boolean  // false se usuário negou permanentemente
   * }
   *
   * Usamos desestruturação de array com renomeação:
   * `[permission, requestPermission]` é mais legível que `[cameraPermission, requestCameraPermission]`
   */
  const [permission, requestPermission] = useCameraPermissions();

  // ───────────────────────────────────────────────────────────────────────
  // REFERÊNCIA À CÂMERA (useRef)
  // ───────────────────────────────────────────────────────────────────────

  /**
   * Referência direta ao componente `CameraView`.
   *
   * O que é `useRef`?
   * É um hook que guarda um valor mutável que NÃO causa re-render quando muda.
   * Diferente de `useState`, alterar `.current` não re-renderiza o componente.
   *
   * Por que precisamos disso?
   * Para chamar métodos imperativos do CameraView, como:
   *   cameraRef.current?.takePictureAsync({ quality: 0.8 })
   *
   * O `?` é optional chaining — previne erro se `current` for null
   * (o que pode acontecer antes do componente ser montado).
   */
  const cameraRef = useRef<CameraView>(null);

  // ───────────────────────────────────────────────────────────────────────
  // ESTADO LOCAL
  // ───────────────────────────────────────────────────────────────────────

  /**
   * Indica se estamos processando a captura da foto.
   * Evita múltiplos cliques no botão enquanto a foto está sendo processada.
   */
  const [capturing, setCapturing] = useState(false);

  // ───────────────────────────────────────────────────────────────────────
  // FUNÇÕES DE CAPTURA E NAVEGAÇÃO
  // ───────────────────────────────────────────────────────────────────────

  /**
   * Captura uma foto usando a câmera.
   *
   * Fluxo:
   * 1. Desabilita o botão (capturing = true) para evitar cliques duplos
   * 2. Chama `takePictureAsync` que retorna um objeto com `{ uri: string }`
   * 3. Passa o URI para o componente pai via callback `onCapture`
   * 4. O componente pai fecha a câmera (muda o estado `showCamera = false`)
   *
   * Opções de `takePictureAsync`:
   * - quality: 0.7 (70% de qualidade) — compressão JPEG, reduz tamanho sem perda visível
   * - base64: false — não retorna a imagem como string Base64 (economiza memória)
   * - exif: false — não inclui metadados EXIF (localização GPS, modelo da câmera, etc.)
   */
  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;

    try {
      setCapturing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7, // Balanço entre qualidade visual e tamanho do arquivo
        base64: false, // Não precisamos da string base64, só do URI do arquivo
        exif: false, // Não precisamos de metadados (economiza processamento)
      });

      if (photo?.uri) {
        onCapture(photo.uri); // Passa o URI temporário para o componente pai
      }
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
      // Em produção, exiba um toast/snackbar informando o erro
    } finally {
      setCapturing(false);
    }
  };

  /**
   * Abre as Configurações do dispositivo para o usuário conceder permissão.
   *
   * Quando o usuário nega a permissão, o sistema iOS/Android não permite
   * que solicitemos novamente (evita spam de diálogos). A única forma é
   * o usuário ir manualmente nas Configurações.
   *
   * `Linking.openSettings()` é uma API do React Native que abre as
   * Configurações do app no sistema operacional.
   */
  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  // ───────────────────────────────────────────────────────────────────────
  // RENDERIZAÇÃO CONDICIONAL POR ESTADO DE PERMISSÃO
  // ───────────────────────────────────────────────────────────────────────

  /**
   * ESTADO 1: Ainda não temos informação sobre a permissão.
   * Isso acontece brevemente enquanto o expo-camera consulta o sistema.
   * Exibimos uma tela preta/vazia (o usuário raramente vê isso, é muito rápido).
   */
  if (!permission) {
    return (
      <View style={styles.container}>
        <Text className="text-white text-lg">Verificando permissões...</Text>
      </View>
    );
  }

  /**
   * ESTADO 2: Permissão negada pelo usuário.
   * Exibimos uma tela explicativa e um botão para ir nas Configurações.
   *
   * Por que não solicitamos novamente automaticamente?
   * - Se `canAskAgain === false`: o sistema não permite (negado permanentemente)
   * - Boa UX: explicar POR QUE precisamos da câmera antes de pedir
   */
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View className="bg-white rounded-2xl p-6 mx-6 items-center">
          <Text className="text-5xl mb-4">📷</Text>
          <Text className="text-xl font-bold text-gray-800 text-center mb-2">
            Acesso à Câmera
          </Text>
          <Text className="text-sm text-gray-600 text-center mb-6">
            Precisamos de permissão para acessar sua câmera e capturar a foto de
            perfil. Seus dados permanecem armazenados apenas no seu dispositivo.
          </Text>

          {/* Botão para solicitar permissão */}
          <TouchableOpacity
            onPress={requestPermission}
            className="bg-indigo-600 px-6 py-3 rounded-xl mb-3 w-full"
          >
            <Text className="text-white text-center font-semibold">
              Conceder Permissão
            </Text>
          </TouchableOpacity>

          {/* Botão para abrir Configurações (caso tenha negado antes) */}
          {!permission.canAskAgain && (
            <TouchableOpacity
              onPress={handleOpenSettings}
              className="bg-gray-200 px-6 py-3 rounded-xl mb-3 w-full"
            >
              <Text className="text-gray-700 text-center font-semibold">
                Abrir Configurações
              </Text>
            </TouchableOpacity>
          )}

          {/* Botão para fechar sem conceder */}
          <TouchableOpacity onPress={onClose}>
            <Text className="text-gray-500 text-sm">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /**
   * ESTADO 3: Permissão concedida — exibimos o preview da câmera.
   *
   * `CameraView` renderiza o feed ao vivo da câmera.
   * `ref={cameraRef}` conecta a referência para chamarmos `takePictureAsync`.
   * `facing="back"` usa a câmera traseira (mude para "front" se quiser frontal).
   */
  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back" // "back" = câmera traseira | "front" = câmera frontal
      >
        {/* Overlay com controles sobre o preview da câmera */}
        <View style={styles.controls}>
          {/* Botão de fechar no canto superior direito */}
          <View className="flex-row justify-end p-4">
            <TouchableOpacity
              onPress={onClose}
              className="bg-black/50 w-10 h-10 rounded-full items-center justify-center"
            >
              <Text className="text-white text-xl font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Espaçador (flex-1 empurra o botão de captura para baixo) */}
          <View className="flex-1" />

          {/* Botão de captura na parte inferior */}
          <View className="items-center pb-10">
            <TouchableOpacity
              onPress={handleCapture}
              disabled={capturing}
              className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 items-center justify-center"
              style={{ opacity: capturing ? 0.5 : 1 }}
            >
              <View className="w-16 h-16 rounded-full bg-white" />
            </TouchableOpacity>

            {capturing && (
              <Text className="text-white text-sm mt-2">Capturando...</Text>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

// =============================================================================
// ESTILOS (StyleSheet — não coberto por NativeWind)
// =============================================================================

/**
 * Usamos `StyleSheet.create` para estilos que não são facilmente expressos
 * com classes Tailwind, ou que precisam de valores especiais do RN.
 *
 * `StyleSheet.absoluteFillObject` é um atalho para:
 * { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }
 * Faz o elemento cobrir toda a tela, independente do scroll.
 */
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Cobre toda a tela
    backgroundColor: '#000', // Fundo preto para a câmera
    justifyContent: 'center', // Centraliza conteúdo verticalmente
    alignItems: 'center', // Centraliza conteúdo horizontalmente
  },
  camera: {
    flex: 1, // Ocupa todo o espaço do container
    width: '100%',
  },
  controls: {
    flex: 1, // Permite que os controles ocupem toda a altura da câmera
    justifyContent: 'space-between', // Distribui botões (topo e base)
  },
});
