/**
 * src/database/database.ts — Inicialização e Conexão com o SQLite
 *
 * O que é SQLite?
 * ───────────────
 * SQLite é um banco de dados relacional leve que armazena os dados em um
 * ÚNICO ARQUIVO local no dispositivo. Não precisa de servidor, não precisa
 * de internet — os dados ficam protegidos dentro do próprio app.
 *
 * Por que SQLite em apps mobile?
 * ────────────────────────────────
 * - Offline-first: funciona sem internet
 * - Persistência: dados sobrevivem ao fechar/reabrir o app
 * - Relacional: suporta SQL completo (SELECT, JOIN, etc.)
 * - Eficiente: muito rápido para volumes de dados típicos de apps mobile
 *
 * expo-sqlite
 * ───────────
 * A biblioteca `expo-sqlite` fornece acesso ao SQLite nativo (iOS e Android)
 * com uma API moderna baseada em Promises/async-await (SDK 52+).
 *
 * API principal usada neste projeto:
 *   - `openDatabaseAsync(nome)` → abre ou cria o arquivo .db
 *   - `db.execAsync(sql)` → executa SQL sem retorno (DDL, PRAGMA)
 *   - `db.runAsync(sql, ...params)` → INSERT/UPDATE/DELETE
 *   - `db.getAllAsync(sql, ...params)` → SELECT que retorna array
 *   - `db.getFirstAsync(sql, ...params)` → SELECT que retorna o primeiro ou null
 */

import * as SQLite from 'expo-sqlite';

// =============================================================================
// CONSTANTES DE CONFIGURAÇÃO
// =============================================================================

/**
 * Nome do arquivo do banco de dados.
 * O SQLite cria este arquivo no diretório de documentos do app no dispositivo.
 * No iOS: ~/Documents/tasks.db
 * No Android: /data/data/com.seu.app/databases/tasks.db
 */
const DATABASE_NAME = 'tasks.db';

// =============================================================================
// PADRÃO SINGLETON — uma única conexão com o banco
// =============================================================================

/**
 * Instância única da conexão com o banco de dados (padrão Singleton).
 *
 * Por que Singleton?
 * O SQLite não lida bem com múltiplas conexões simultâneas ao mesmo arquivo.
 * Manter uma única instância reutilizada garante consistência e evita
 * condições de corrida (race conditions) em operações concorrentes.
 *
 * O tipo `SQLite.SQLiteDatabase | null` indica que esta variável começa
 * sem conexão (null) e depois recebe a instância real.
 */
let database: SQLite.SQLiteDatabase | null = null;

// =============================================================================
// FUNÇÃO PRINCIPAL DE ACESSO
// =============================================================================

/**
 * Retorna a instância do banco de dados, criando-a na primeira chamada.
 *
 * Este é o ponto central de acesso ao banco. Todos os repositórios chamam
 * esta função para obter a conexão antes de executar qualquer operação.
 *
 * Fluxo:
 * 1. Se já existe uma conexão aberta → retorna ela (evita abrir duas vezes)
 * 2. Se NÃO existe → abre o arquivo, executa as migrações, guarda a instância
 *
 * @returns Promise com a instância do banco de dados pronta para uso
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  // Se a conexão já foi criada anteriormente, reutiliza-a (Singleton)
  if (database !== null) {
    return database;
  }

  // Abre o banco de dados — se o arquivo não existir, o SQLite o cria
  database = await SQLite.openDatabaseAsync(DATABASE_NAME);

  // Executa as migrações para garantir que as tabelas existam
  await runMigrations(database);

  return database;
}

// =============================================================================
// MIGRAÇÕES — estrutura do banco de dados
// =============================================================================

/**
 * Executa as migrações do banco de dados.
 *
 * O que são "migrações"?
 * São scripts SQL que evoluem a estrutura do banco ao longo do tempo.
 * Usamos `IF NOT EXISTS` para que os scripts sejam idempotentes —
 * podem ser executados múltiplas vezes sem causar erros.
 *
 * `execAsync` é usado para DDL (Data Definition Language):
 * comandos que DEFINEM estrutura (CREATE, ALTER, DROP).
 * Diferente do `runAsync`, não retorna resultados.
 *
 * Estrutura da tabela `tasks`:
 * ┌──────────────┬──────────────────────────────────────────────┐
 * │ Coluna       │ Descrição                                    │
 * ├──────────────┼──────────────────────────────────────────────┤
 * │ id           │ Chave primária com auto incremento           │
 * │ title        │ Título obrigatório (NOT NULL)                │
 * │ description  │ Descrição opcional (pode ser NULL)           │
 * │ completed    │ 0 = pendente, 1 = concluída (padrão: 0)     │
 * │ createdAt    │ Data de criação em ISO 8601                  │
 * └──────────────┴──────────────────────────────────────────────┘
 *
 * @param db Instância da conexão com o banco de dados
 */
async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    -- WAL (Write-Ahead Logging): melhora performance em escritas concorrentes.
    -- O banco grava em um log temporário antes de aplicar no arquivo principal,
    -- reduzindo bloqueios e melhorando a velocidade de escrita.
    PRAGMA journal_mode = WAL;

    -- Cria a tabela de tarefas se ainda não existir.
    -- IF NOT EXISTS garante que esta instrução é segura para re-execução.
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT,
      completed   INTEGER NOT NULL DEFAULT 0,
      createdAt   TEXT    NOT NULL
    );

    -- Cria a tabela de perfil do usuário se ainda não existir.
    -- Esta tabela armazena um único registro (id fixo = 1) com os dados do usuário.
    --
    -- Estrutura da tabela 'profile':
    -- ┌──────────────┬──────────────────────────────────────────────┐
    -- │ Coluna       │ Descrição                                    │
    -- ├──────────────┼──────────────────────────────────────────────┤
    -- │ id           │ Chave primária (sempre 1 — registro único)   │
    -- │ name         │ Nome do usuário (padrão: string vazia)       │
    -- │ email        │ Email do usuário (padrão: string vazia)      │
    -- │ photoUri     │ Caminho da foto de perfil (pode ser NULL)    │
    -- └──────────────┴──────────────────────────────────────────────┘
    --
    -- Por que id NÃO usa AUTOINCREMENT?
    -- Como só existe um perfil por app, sempre fazemos INSERT com id=1.
    -- O AUTOINCREMENT é útil para múltiplos registros (como tasks), mas aqui
    -- seria desnecessário e adicionaria sobrecarga ao banco.
    CREATE TABLE IF NOT EXISTS profile (
      id       INTEGER PRIMARY KEY,
      name     TEXT    NOT NULL DEFAULT '',
      email    TEXT    NOT NULL DEFAULT '',
      photoUri TEXT
    );
  `);
}
