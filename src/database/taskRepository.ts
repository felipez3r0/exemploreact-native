/**
 * src/database/taskRepository.ts — Repositório de Tarefas (Camada de Dados)
 *
 * O que é o padrão Repository?
 * ─────────────────────────────
 * O Repository é um padrão de design que ABSTRAI o acesso a dados.
 * Em vez de espalhar código SQL por todo o app, centralizamos aqui.
 *
 * Benefícios desta abordagem:
 * ✅ Os componentes não precisam saber COMO os dados são buscados
 * ✅ Se trocarmos SQLite por uma API REST, só mudamos este arquivo
 * ✅ Código SQL fica organizado e fácil de auditar
 * ✅ Cada função tem uma responsabilidade única (Single Responsibility)
 *
 * Segurança — SQL Injection:
 * ──────────────────────────
 * Nunca concatene valores direto no SQL! Exemplo INSEGURO:
 *   db.runAsync(`SELECT * FROM tasks WHERE id = ${id}`)  // ❌ PERIGOSO!
 *
 * O `?` é um "bind parameter" (parâmetro de ligação). O SQLite escapa
 * automaticamente os valores, impedindo SQL Injection:
 *   db.runAsync('SELECT * FROM tasks WHERE id = ?', id)  // ✅ SEGURO
 *
 * API do expo-sqlite usada aqui:
 *   db.getAllAsync<T>(sql, ...params) → T[]          — múltiplas linhas
 *   db.getFirstAsync<T>(sql, ...params) → T | null  — primeira linha ou null
 *   db.runAsync(sql, ...params) → { lastInsertRowId, changes }
 */

import { getDatabase } from './database';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

// =============================================================================
// READ — Operações de Leitura
// =============================================================================

/**
 * Retorna todas as tarefas do banco de dados.
 *
 * ORDER BY createdAt DESC → mais recentes primeiro.
 * `getAllAsync<Task>` usa generics do TypeScript para tipar o retorno:
 * o SQLite mapeia automaticamente as colunas da tabela para os campos da interface Task.
 *
 * @returns Array com todas as tarefas (pode ser vazio [])
 */
export async function getTasks(): Promise<Task[]> {
  const db = await getDatabase();

  return db.getAllAsync<Task>('SELECT * FROM tasks ORDER BY createdAt DESC');
}

/**
 * Busca uma única tarefa pelo seu ID.
 *
 * `getFirstAsync<Task>` retorna o primeiro resultado ou `null`.
 * Isso é útil para buscar por chave primária — esperamos 0 ou 1 resultado.
 *
 * @param id O identificador único da tarefa
 * @returns A tarefa encontrada, ou `null` se não existir
 */
export async function getTaskById(id: number): Promise<Task | null> {
  const db = await getDatabase();

  return db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', id);
}

// =============================================================================
// CREATE — Operação de Criação
// =============================================================================

/**
 * Insere uma nova tarefa no banco de dados.
 *
 * `runAsync` é usado para INSERT, UPDATE, DELETE.
 * Retorna um objeto com:
 *   - `lastInsertRowId`: o ID gerado pelo AUTOINCREMENT para o novo registro
 *   - `changes`: número de linhas afetadas (aqui sempre 1)
 *
 * Após inserir, buscamos a tarefa completa pelo ID recém-gerado para
 * retornar o objeto Task com todos os campos, incluindo `id` e `createdAt`.
 *
 * O operador `!` (non-null assertion) é seguro aqui porque acabamos de
 * inserir a tarefa — ela certamente existe no banco.
 *
 * @param input Título e descrição da nova tarefa
 * @returns A tarefa recém-criada com seu ID gerado pelo banco
 */
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const db = await getDatabase();

  // Gera a data de criação no formato ISO 8601 (ex: "2024-03-15T10:30:00.000Z")
  const createdAt = new Date().toISOString();

  const result = await db.runAsync(
    'INSERT INTO tasks (title, description, completed, createdAt) VALUES (?, ?, 0, ?)',
    input.title,
    input.description,
    createdAt,
  );

  // Busca a tarefa completa usando o ID gerado pelo banco
  const newTask = await getTaskById(result.lastInsertRowId);

  // O `!` diz ao TypeScript: "tenho certeza que este valor não é null"
  // É seguro aqui porque acabamos de inserir e buscar imediatamente
  return newTask!;
}

// =============================================================================
// UPDATE — Operações de Atualização
// =============================================================================

/**
 * Atualiza o título e a descrição de uma tarefa existente.
 *
 * Note que não retornamos nada (void) — apenas confirmamos que a operação
 * foi executada. O chamador (hook) recarrega os dados depois.
 *
 * @param input Objeto com id, novo título e nova descrição
 */
export async function updateTask(input: UpdateTaskInput): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
    input.title,
    input.description,
    input.id,
  );
}

/**
 * Alterna (toggle) o status de conclusão de uma tarefa.
 *
 * Esta função recebe o NOVO valor de `completed`, não o atual.
 * Cabe ao chamador (hook) calcular o novo valor:
 *   const novoValor = tarefa.completed === 0 ? 1 : 0;
 *
 * Por que receber o novo valor em vez de calcular aqui?
 * Porque o repositório não deve ter lógica de negócio — ele só persiste dados.
 * A decisão de "inverter" é responsabilidade do hook (camada de negócio).
 *
 * @param id O ID da tarefa
 * @param completed O novo valor de conclusão (0 = pendente, 1 = concluída)
 */
export async function toggleTaskComplete(
  id: number,
  completed: number,
): Promise<void> {
  const db = await getDatabase();

  await db.runAsync(
    'UPDATE tasks SET completed = ? WHERE id = ?',
    completed,
    id,
  );
}

// =============================================================================
// DELETE — Operação de Exclusão
// =============================================================================

/**
 * Remove permanentemente uma tarefa do banco de dados.
 *
 * ⚠️ Esta operação é IRREVERSÍVEL. A confirmação com o usuário
 * (Alert.alert) deve ser feita no componente ANTES de chamar esta função.
 *
 * @param id O ID da tarefa a ser removida
 */
export async function deleteTask(id: number): Promise<void> {
  const db = await getDatabase();

  await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
}
