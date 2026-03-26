/**
 * src/database/profileRepository.ts — Repositório de Perfil (Camada de Dados)
 *
 * Este repositório gerencia o perfil do usuário, que é um REGISTRO ÚNICO
 * (diferente de `taskRepository` que gerencia múltiplos registros).
 *
 * Conceitos importantes neste arquivo:
 * ─────────────────────────────────────
 * 1. UPSERT (UPDATE + INSERT):
 *    Usamos `INSERT OR REPLACE` — se o registro com id=1 não existe, insere;
 *    se já existe, substitui. Isso elimina a necessidade de checar antes.
 *
 * 2. ID FIXO (sempre 1):
 *    Como só existe um perfil por app, sempre operamos com `id = 1`.
 *    Não precisamos de AUTOINCREMENT (usado para múltiplos registros).
 *
 * 3. DADOS VAZIOS POR PADRÃO:
 *    Quando o usuário abre o app pela primeira vez, o perfil não existe.
 *    A tela exibe campos vazios e permite preenchimento/salvamento.
 *
 * Comparação com taskRepository:
 * ───────────────────────────────
 * | Aspecto          | taskRepository          | profileRepository         |
 * |------------------|-------------------------|---------------------------|
 * | Registros        | Múltiplos (id: 1,2,3..) | Único (id: sempre 1)      |
 * | ID               | AUTOINCREMENT gerado    | Fixo, fornecido no INSERT |
 * | Criação          | createTask() → ID novo  | saveProfile() → id=1      |
 * | Atualização      | updateTask(id, data)    | saveProfile() → upsert    |
 * | Operação unific. | Não                     | Sim (INSERT OR REPLACE)   |
 */

import { getDatabase } from './database';
import { UserProfile, SaveProfileInput } from '../types/profile';

// =============================================================================
// READ — Operação de Leitura
// =============================================================================

/**
 * Retorna o perfil do usuário.
 *
 * Como só existe um perfil (id=1), buscamos com `LIMIT 1` para garantir
 * que a query nunca retorne mais de um resultado (embora só possa existir um).
 *
 * `getFirstAsync<UserProfile>` retorna:
 * - O objeto UserProfile se o registro existe no banco
 * - `null` se o usuário ainda não salvou o perfil (primeira vez usando o app)
 *
 * @returns O perfil do usuário ou `null` se ainda não foi criado
 */
export async function getProfile(): Promise<UserProfile | null> {
  const db = await getDatabase();

  return db.getFirstAsync<UserProfile>(
    'SELECT * FROM profile WHERE id = 1 LIMIT 1',
  );
}

// =============================================================================
// CREATE/UPDATE — Operação Unificada (Upsert)
// =============================================================================

/**
 * Salva (cria ou atualiza) o perfil do usuário.
 *
 * O que é "upsert"?
 * ─────────────────
 * "Upsert" = UPDATE + INSERT
 * É uma operação que:
 * - Se o registro NÃO existe → insere (INSERT)
 * - Se o registro JÁ existe → substitui (UPDATE)
 *
 * No SQLite, isso é feito com `INSERT OR REPLACE`:
 *   INSERT OR REPLACE INTO profile (id, name, email, photoUri) VALUES (1, ?, ?, ?)
 *
 * Como funciona "OR REPLACE":
 * ───────────────────────────
 * 1. O SQLite tenta fazer um INSERT com id=1
 * 2. Se id=1 já existe (conflito na PRIMARY KEY):
 *    → Remove a linha existente
 *    → Insere a nova linha
 * 3. Se id=1 não existe:
 *    → Insere normalmente
 *
 * Resultado prático: sempre teremos exatamente UM perfil com id=1,
 * sem precisar de lógica condicional IF EXISTS no código.
 *
 * Alternativas (mais complexas):
 * ──────────────────────────────
 * Poderíamos usar:
 * - `INSERT ... ON CONFLICT (id) DO UPDATE SET ...` (mais verboso, mesmo efeito)
 * - Checar com SELECT primeiro, depois INSERT ou UPDATE (duas queries, mais lento)
 *
 * Por que escolhemos INSERT OR REPLACE?
 * - Simples e atômico (uma única query)
 * - Padrão consolidado para registros únicos
 * - Menos código, menos pontos de falha
 *
 * @param input Dados do perfil a serem salvos (name, email, photoUri)
 */
export async function saveProfile(input: SaveProfileInput): Promise<void> {
  const db = await getDatabase();

  // O id é sempre 1 (registro único).
  // O `?` para cada campo garante segurança contra SQL Injection.
  await db.runAsync(
    'INSERT OR REPLACE INTO profile (id, name, email, photoUri) VALUES (1, ?, ?, ?)',
    input.name,
    input.email,
    input.photoUri,
  );
}
