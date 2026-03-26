/**
 * src/types/profile.ts — Definições de Tipos TypeScript para o módulo de Perfil
 *
 * Define a estrutura de dados do perfil do usuário, incluindo informações
 * básicas (nome e email) e a foto capturada pela câmera do dispositivo.
 *
 * Conceitos importantes neste módulo:
 * ✅ Armazenamento de foto: salvamos o CAMINHO do arquivo, não a imagem em si
 * ✅ Registro único: só existe um perfil por app (id fixo = 1)
 * ✅ photoUri nullable: usuário pode não ter foto ainda
 *
 * Por que salvar o caminho (`photoUri`) em vez da imagem em Base64?
 * ------------------------------------------------------------------
 * 1. PERFORMANCE: Imagens em Base64 ocupam ~33% mais espaço que o arquivo original
 * 2. MEMÓRIA: Não precisamos carregar a imagem inteira na RAM ao buscar o perfil
 * 3. SIMPLICIDADE: O componente <Image source={{ uri: photoUri }} /> aceita
 *    caminhos de arquivo diretamente — não precisamos decodificar
 * 4. PADRÃO PROFISSIONAL: Apps reais armazenam referências, não dados binários
 */

// =============================================================================
// INTERFACE PRINCIPAL
// =============================================================================

/**
 * Representa o perfil completo do usuário como ele existe no banco de dados.
 *
 * Diferente de `Task` que usa `id: number` com AUTOINCREMENT (múltiplos registros),
 * aqui o `id` é sempre 1 (registro único). Isso simplifica o upsert:
 * sempre fazemos `INSERT OR REPLACE INTO profile (id, ...) VALUES (1, ...)`.
 */
export interface UserProfile {
  /** Identificador fixo (sempre 1) — só existe um perfil por app */
  id: number;

  /** Nome completo do usuário */
  name: string;

  /** Endereço de email do usuário */
  email: string;

  /**
   * Caminho local da foto de perfil no dispositivo.
   *
   * Formato típico: "file:///data/user/0/.../DocumentDirectory/profile-12345.jpg"
   *
   * `null` quando o usuário ainda não capturou uma foto.
   * Quando `null`, a tela exibe um placeholder (ícone de câmera).
   *
   * IMPORTANTE: Este é um caminho PERMANENTE.
   * Quando capturamos a foto com `expo-camera`, ela fica em um diretório
   * temporário e pode ser deletada pelo sistema. Por isso, copiamos o arquivo
   * para `FileSystem.documentDirectory` (armazenamento permanente do app)
   * usando `FileSystem.copyAsync()`.
   */
  photoUri: string | null;
}

// =============================================================================
// INTERFACES DE ENTRADA (Input Types)
// =============================================================================

/**
 * Dados necessários para SALVAR o perfil (criar ou atualizar).
 *
 * Note que NÃO incluímos `id` no input porque ele é sempre fixo (1).
 * A função `saveProfile()` no repositório adiciona `id: 1` automaticamente.
 *
 * Este input é usado tanto para criar o perfil pela primeira vez
 * quanto para atualizar dados já existentes — o `INSERT OR REPLACE`
 * do SQLite cuida de decidir a operação correta.
 */
export interface SaveProfileInput {
  name: string;
  email: string;
  photoUri: string | null;
}
