/**
 * src/types/task.ts — Definições de Tipos TypeScript para o módulo de Tarefas
 *
 * TypeScript adiciona tipagem estática ao JavaScript. Isso significa que
 * definimos ANTECIPADAMENTE a "forma" que nossos dados devem ter.
 *
 * Benefícios práticos:
 * ✅ Editor avisa se você esquecer um campo obrigatório
 * ✅ Autocompletar com os campos disponíveis
 * ✅ Erros de tipo são detectados ANTES de rodar o app
 * ✅ Código se auto-documenta: qualquer pessoa sabe o que é uma Task
 *
 * Conceitos TypeScript usados neste arquivo:
 * - `interface`: define a estrutura de um objeto
 * - `type`: cria um alias para um tipo existente (aqui, union type com |)
 * - `string | null`: union type — o valor pode ser string OU null
 * - `0 | 1`: literal type numérico — só aceita exatamente 0 ou 1
 */

// =============================================================================
// INTERFACE PRINCIPAL
// =============================================================================

/**
 * Representa uma Tarefa completa como ela existe no banco de dados.
 *
 * Uma `interface` define um "contrato": qualquer objeto do tipo Task DEVE
 * possuir todos esses campos com os tipos exatamente especificados.
 *
 * NOTA sobre `completed`:
 * O SQLite não tem tipo BOOLEAN nativo — usa 0 (falso) e 1 (verdadeiro).
 * Poderíamos usar `boolean` no TypeScript e converter, mas manter como
 * `number` evita conversões desnecessárias e deixa o mapeamento explícito.
 */
export interface Task {
  /** Identificador único, gerado automaticamente pelo SQLite (AUTOINCREMENT) */
  id: number;

  /** Título da tarefa — campo obrigatório, não pode ser vazio */
  title: string;

  /**
   * Descrição detalhada da tarefa.
   * O `| null` significa que este campo é opcional: quando o usuário não
   * informa uma descrição, o banco armazena NULL (e o TypeScript exige
   * que você trate esse caso antes de usar o valor).
   */
  description: string | null;

  /**
   * Status de conclusão.
   * SQLite usa INTEGER: 0 = pendente, 1 = concluída.
   *
   * Para checar: `if (task.completed === 1)` ou `if (task.completed === 0)`
   */
  completed: number;

  /**
   * Data e hora de criação no formato ISO 8601.
   * Exemplo: "2024-03-15T10:30:00.000Z"
   *
   * Este formato é ideal para:
   * - Ordenação por data como string (funciona corretamente)
   * - Exibição formatada com `new Date(createdAt).toLocaleDateString('pt-BR')`
   * - Compatibilidade universal entre dispositivos e fusos horários
   */
  createdAt: string;
}

// =============================================================================
// TIPOS AUXILIARES (Union Types)
// =============================================================================

/**
 * Representa os filtros disponíveis na tela principal.
 *
 * Um `type` com `|` (pipe) cria um "union type" — a variável só pode assumir
 * um desses valores exatos. É mais seguro que usar `string` livre.
 *
 * Uso prático:
 *   const [filter, setFilter] = useState<TaskFilter>('all');
 *   setFilter('pending');   // ✅ válido
 *   setFilter('todas');     // ❌ erro TypeScript — 'todas' não é TaskFilter
 */
export type TaskFilter = 'all' | 'pending' | 'completed';

// =============================================================================
// INTERFACES DE ENTRADA (Input Types)
// =============================================================================

/**
 * Dados necessários para CRIAR uma nova tarefa.
 *
 * Note que NÃO incluímos:
 * - `id` → gerado automaticamente pelo banco (AUTOINCREMENT)
 * - `completed` → sempre inicia como 0 (pendente)
 * - `createdAt` → gerado com `new Date().toISOString()` no repositório
 *
 * Isso evita que o chamador precise fornecer campos que ele não controla,
 * seguindo o princípio de "mínima superfície de API".
 */
export interface CreateTaskInput {
  title: string;
  description: string | null;
}

/**
 * Dados necessários para EDITAR uma tarefa existente.
 *
 * Só permitimos editar `title` e `description`.
 * O status `completed` é gerenciado separadamente pelo toggle.
 * O `id` é obrigatório para sabermos qual tarefa atualizar.
 */
export interface UpdateTaskInput {
  id: number;
  title: string;
  description: string | null;
}
