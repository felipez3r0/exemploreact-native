/**
 * src/hooks/useProfile.ts — Hook Customizado de Gerenciamento de Perfil
 *
 * Hook que gerencia o estado e as operações do perfil do usuário.
 * Segue o mesmo padrão arquitetural de `useTasks`, mas adaptado para
 * um REGISTRO ÚNICO em vez de uma lista.
 *
 * Comparação com useTasks:
 * ────────────────────────
 * | Aspecto           | useTasks                  | useProfile               |
 * |-------------------|---------------------------|--------------------------|
 * | Estado principal  | Task[] (array)            | UserProfile \| null      |
 * | Filtros           | Sim (all/pending/done)    | Não (registro único)     |
 * | Operação criação  | Separada (createTask)     | Unificada (saveProfile)  |
 * | Operação edição   | Separada (updateTask)     | Unificada (saveProfile)  |
 * | Recarregamento    | useFocusEffect            | useFocusEffect           |
 *
 * Por que separar a lógica em um hook?
 * ────────────────────────────────────
 * ✅ SEPARAÇÃO: componente (UI) não precisa saber sobre banco de dados
 * ✅ REUTILIZAÇÃO: se uma segunda tela precisar do perfil, basta chamar useProfile()
 * ✅ TESTABILIDADE: podemos testar a lógica isoladamente, sem renderizar componentes
 * ✅ CONSISTÊNCIA: padrão previsível — todos os hooks seguem a mesma estrutura
 */

import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import * as ProfileRepository from '../database/profileRepository';
import { UserProfile, SaveProfileInput } from '../types/profile';

// =============================================================================
// TIPO DE RETORNO DO HOOK
// =============================================================================

/**
 * Define o contrato de retorno do hook — o que ele expõe para os componentes.
 */
interface UseProfileReturn {
  /** Perfil do usuário ou `null` se ainda não foi criado */
  profile: UserProfile | null;
  /** Indica se os dados estão sendo carregados do banco */
  loading: boolean;
  /** Salva (cria ou atualiza) o perfil no banco de dados */
  saveProfile: (input: SaveProfileInput) => Promise<void>;
}

// =============================================================================
// O HOOK
// =============================================================================

/**
 * Hook que gerencia o estado e as operações do perfil do usuário.
 *
 * @returns Objeto com perfil atual, status de carregamento e função de salvar
 */
export function useProfile(): UseProfileReturn {
  // Estado do perfil — null indica que ainda não foi criado (primeira vez usando o app)
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Estado de carregamento — começa como true (dados ainda não foram buscados)
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────────────────────────────────────
  // FUNÇÃO DE CARREGAMENTO
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Busca o perfil do banco de dados e atualiza o estado.
   *
   * `useCallback` com dependências `[]` cria uma referência de memória estável.
   * Isso é necessário para `useFocusEffect` funcionar corretamente — ele
   * compara referências de função para decidir se deve re-executar o efeito.
   *
   * Se o perfil não existir no banco (primeira execução do app), `profile`
   * ficará como `null` e o componente pode exibir um formulário vazio.
   */
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProfileRepository.getProfile();
      setProfile(data); // Pode ser null se o perfil não foi criado ainda
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      // Em produção, notifique o usuário com toast/snackbar
    } finally {
      setLoading(false); // Sempre desativa o loading, mesmo com erro
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // EFEITO DE FOCO
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Recarrega o perfil sempre que a tela ganhar foco na navegação.
   *
   * Embora o perfil não seja editado em outra tela (diferente de tasks),
   * manter o padrão `useFocusEffect` garante:
   * - Consistência arquitetural com outros hooks
   * - Preparação para features futuras (ex: editar perfil em modal)
   * - Sincronização automática se o perfil for alterado por outro processo
   *
   * IMPORTANTE: `useFocusEffect` espera um callback SÍNCRONO.
   * Por isso, encapsulamos `loadProfile` (async) em um useCallback que NÃO
   * retorna a Promise — apenas dispara a execução e descarta o retorno.
   */
  useFocusEffect(
    useCallback(() => {
      loadProfile(); // Sem await — retorno descartado intencionalmente
    }, [loadProfile]),
  );

  // ─────────────────────────────────────────────────────────────────────────
  // OPERAÇÃO DE SALVAMENTO (UPSERT)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Salva (cria ou atualiza) o perfil do usuário no banco de dados.
   *
   * Esta função é unificada: não há distinção entre "criar" e "editar".
   * O repositório usa `INSERT OR REPLACE`, que automaticamente decide se
   * deve inserir um novo registro ou substituir o existente.
   *
   * Após salvar, recarrega o perfil do banco para garantir que o estado
   * está sincronizado (ex: caso o banco aplique transformações).
   *
   * @param input Dados do perfil a serem salvos (name, email, photoUri)
   */
  const handleSave = useCallback(
    async (input: SaveProfileInput) => {
      try {
        await ProfileRepository.saveProfile(input);
        await loadProfile(); // Recarrega para sincronizar o estado local
      } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        // Em produção, notifique o usuário e permita tentar novamente
        throw error; // Re-lança para que o componente possa tratar (ex: exibir erro)
      }
    },
    [loadProfile],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RETORNO DO HOOK
  // ─────────────────────────────────────────────────────────────────────────

  return {
    profile, // Perfil atual ou null se não existe
    loading, // Indica se está buscando do banco
    saveProfile: handleSave, // Função para salvar (criar ou atualizar)
  };
}
