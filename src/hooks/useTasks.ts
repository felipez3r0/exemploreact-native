/**
 * src/hooks/useTasks.ts — Hook Customizado de Gerenciamento de Tarefas
 *
 * O que são Custom Hooks?
 * ────────────────────────
 * Hooks customizados são funções que ENCAPSULAM lógica reutilizável com estado.
 * Eles seguem a convenção de começar com `use` (ex: useTasks, useAuth).
 *
 * Por que criar um hook em vez de colocar a lógica direto no componente?
 * ────────────────────────────────────────────────────────────────────────
 * ✅ SEPARAÇÃO DE RESPONSABILIDADES: componente cuida da UI, hook cuida dos dados
 * ✅ REUTILIZAÇÃO: se uma segunda tela precisar da lista, basta chamar useTasks()
 * ✅ TESTABILIDADE: podemos testar a lógica do hook isoladamente, sem UI
 * ✅ LEITURA: o componente fica pequeno e fácil de entender
 *
 * Hooks do React usados aqui:
 * ────────────────────────────
 * - `useState<T>`: armazena um valor no estado do componente.
 *   Quando o valor muda, o React re-renderiza o componente.
 *
 * - `useCallback`: memoriza uma função para que ela não seja recriada
 *   a cada renderização. Importante para evitar loops infinitos com
 *   `useFocusEffect`, que depende da referência estável da função.
 *
 * - `useFocusEffect` (Expo Router / React Navigation): executa um efeito
 *   SEMPRE que a tela ganha foco na navegação — diferente do `useEffect`,
 *   que só roda uma vez (na montagem). Isso garante que ao voltar da tela
 *   de formulário, a lista seja recarregada automaticamente.
 *
 * Filtragem no frontend vs. backend:
 * ────────────────────────────────────
 * Buscamos TODAS as tarefas e filtramos no JavaScript (frontend).
 * Isso é aceitável para volumes pequenos e evita múltiplas queries.
 * Para grandes volumes, a filtragem deveria ser feita via SQL (WHERE completed = ?).
 */

import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import * as TaskRepository from '../database/taskRepository';
import { Task, TaskFilter } from '../types/task';

// =============================================================================
// TIPO DE RETORNO DO HOOK
// =============================================================================

/**
 * Define exatamente o que o hook expõe para os componentes.
 * Documentar o retorno facilita o uso por outros desenvolvedores.
 */
interface UseTasksReturn {
  /** Tarefas já filtradas pelo filtro ativo */
  tasks: Task[];
  /** Contagem total de tarefas (independente do filtro) */
  allTasksCount: number;
  /** Contagem de tarefas pendentes */
  pendingCount: number;
  /** Contagem de tarefas concluídas */
  completedCount: number;
  /** Filtro atualmente ativo */
  filter: TaskFilter;
  /** Indica se os dados estão sendo carregados do banco */
  loading: boolean;
  /** Altera o filtro ativo */
  setFilter: (filter: TaskFilter) => void;
  /** Alterna o status de conclusão de uma tarefa */
  toggleTask: (id: number, currentCompleted: number) => Promise<void>;
  /** Remove uma tarefa permanentemente */
  removeTask: (id: number) => Promise<void>;
}

// =============================================================================
// O HOOK
// =============================================================================

/**
 * Hook que gerencia toda a lógica de estado e operações da lista de tarefas.
 *
 * @returns Objeto com dados e funções para interagir com as tarefas
 */
export function useTasks(): UseTasksReturn {
  // Estado da lista de TODAS as tarefas vindas do banco (sem filtro)
  const [tasks, setTasks] = useState<Task[]>([]);

  // Estado do filtro ativo — começa mostrando todas as tarefas
  const [filter, setFilter] = useState<TaskFilter>('all');

  // Estado de carregamento — começa como true (dados ainda não foram buscados)
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────────────────────────────────────
  // FUNÇÃO DE CARREGAMENTO
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Busca todas as tarefas do banco de dados e atualiza o estado.
   *
   * `useCallback` com dependências `[]` cria uma função estável — a mesma
   * referência de memória é mantida entre renderizações. Isso é necessário
   * porque `useFocusEffect` compara referências para decidir se re-executa.
   *
   * O bloco try/catch/finally garante que `loading` volte a false mesmo
   * se ocorrer um erro, evitando que a tela fique travada com spinner.
   */
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await TaskRepository.getTasks();
      setTasks(data);
    } catch (error) {
      // Em produção, use uma biblioteca de toast/snackbar para notificar o usuário
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      // `finally` executa sempre, com sucesso ou erro
      setLoading(false);
    }
  }, []); // [] = sem dependências → função nunca é recriada

  // ─────────────────────────────────────────────────────────────────────────
  // EFEITO DE FOCO
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Recarrega a lista sempre que esta tela ganhar foco na pilha de navegação.
   *
   * Diferença entre useEffect e useFocusEffect:
   * - useEffect(() => {}, []):  executa UMA VEZ ao montar o componente
   * - useFocusEffect(callback): executa CADA VEZ que a tela fica visível
   *
   * Isso é essencial para que ao voltar da tela de formulário (após adicionar
   * ou editar uma tarefa), a lista seja atualizada automaticamente.
   *
   * IMPORTANTE: `useFocusEffect` espera um callback SÍNCRONO (EffectCallback),
   * não uma função async. Por isso encapsulamos `loadTasks` (que é async)
   * dentro de um useCallback síncrono que a chama mas NÃO retorna a Promise.
   *
   * O wrapper com `useCallback([loadTasks])` garante estabilidade de referência:
   * só será recriado se `loadTasks` mudar (o que não acontece, pois `loadTasks`
   * tem dependências `[]`).
   */
  useFocusEffect(
    useCallback(() => {
      // Chama loadTasks sem await — o retorno da Promise é descartado intencionalmente
      // para que o callback permaneça síncrono (void) como exige o useFocusEffect
      loadTasks();
    }, [loadTasks]),
  );

  // ─────────────────────────────────────────────────────────────────────────
  // FILTRAGEM
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Deriva a lista filtrada a partir do estado `tasks` e `filter`.
   *
   * Esta é uma "variável computada" — não é estado, é calculada em cada render.
   * Como depende de `tasks` (estado), sempre estará sincronizada.
   */
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return task.completed === 0; // só pendentes
    if (filter === 'completed') return task.completed === 1; // só concluídas
    return true; // 'all' — retorna tudo
  });

  // ─────────────────────────────────────────────────────────────────────────
  // CONTADORES (derivados do estado)
  // ─────────────────────────────────────────────────────────────────────────

  // Calculados a partir de `tasks` (sem filtro) para mostrar contagens reais
  const pendingCount = tasks.filter((t) => t.completed === 0).length;
  const completedCount = tasks.filter((t) => t.completed === 1).length;

  // ─────────────────────────────────────────────────────────────────────────
  // OPERAÇÕES CRUD
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Alterna o status de conclusão de uma tarefa.
   *
   * Recebe o valor ATUAL de `completed` e calcula o oposto:
   *   0 (pendente) → 1 (concluída)
   *   1 (concluída) → 0 (pendente)
   *
   * Após a operação, recarrega a lista para refletir a mudança na UI.
   */
  const toggleTask = useCallback(
    async (id: number, currentCompleted: number) => {
      try {
        const newCompleted = currentCompleted === 0 ? 1 : 0;
        await TaskRepository.toggleTaskComplete(id, newCompleted);
        await loadTasks(); // Recarrega para atualizar a UI
      } catch (error) {
        console.error('Erro ao alterar status da tarefa:', error);
      }
    },
    [loadTasks], // Depende de loadTasks (função estável do useCallback acima)
  );

  /**
   * Remove uma tarefa permanentemente do banco.
   *
   * A confirmação do usuário (Alert) deve ser feita NO COMPONENTE,
   * antes de chamar esta função. O repositório (e o hook) só executam
   * a operação solicitada — não tomam decisões de UX.
   */
  const removeTask = useCallback(
    async (id: number) => {
      try {
        await TaskRepository.deleteTask(id);
        await loadTasks(); // Recarrega para remover o item da UI
      } catch (error) {
        console.error('Erro ao remover tarefa:', error);
      }
    },
    [loadTasks],
  );

  // ─────────────────────────────────────────────────────────────────────────
  // RETORNO DO HOOK
  // ─────────────────────────────────────────────────────────────────────────

  return {
    tasks: filteredTasks, // Lista já filtrada — use esta no componente
    allTasksCount: tasks.length, // Total sem filtro — para exibir nos badges
    pendingCount,
    completedCount,
    filter,
    loading,
    setFilter,
    toggleTask,
    removeTask,
  };
}
