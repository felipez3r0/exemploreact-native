# 📋 Lista de Tarefas com React Native + Expo

> Repositório educacional da disciplina **Desenvolvimento para Dispositivos Móveis**  
> Fatec — Análise e Desenvolvimento de Sistemas

Um aplicativo completo de **Lista de Tarefas** construído com React Native e Expo, utilizando SQLite para persistência local de dados. Este projeto foi criado como guia prático para você aprender os conceitos fundamentais do desenvolvimento mobile com React Native.

---

## 🎯 O que você vai aprender

Ao estudar e reproduzir este projeto, você terá contato com:

- ⚛️ **React Native** e seus componentes principais (`View`, `Text`, `FlatList`, `TextInput`, etc.)
- 📱 **Expo SDK 55** e o ecossistema Expo
- 🗂️ **Expo Router** — roteamento baseado em arquivos (como Next.js para mobile)
- 🗄️ **expo-sqlite** — banco de dados local com SQL no dispositivo
- 🎨 **NativeWind** — Tailwind CSS no React Native
- 🔷 **TypeScript** — tipagem estática para segurança e produtividade
- 🪝 **Custom Hooks** — separação de lógica com `useTasks`
- 🏗️ **Boas práticas** — Repository Pattern, Separation of Concerns, DRY

---

## 📱 Funcionalidades do App

| Funcionalidade        | Descrição                                            |
| --------------------- | ---------------------------------------------------- |
| ➕ Adicionar tarefa   | Título e descrição com validação                     |
| ✅ Concluir tarefa    | Toggle de status com visual atualizado               |
| ✏️ Editar tarefa      | Edição de título e descrição                         |
| 🗑️ Excluir tarefa     | Com confirmação de segurança                         |
| 🔍 Filtrar tarefas    | Por: Todas / Pendentes / Concluídas                  |
| 💾 Persistência local | Dados salvos com SQLite — sobrevivem ao fechar o app |

---

## 🛠️ Pré-requisitos

Antes de começar, você precisa ter instalado:

### 1. Node.js (versão 18 ou superior)

```bash
# Verifique se já está instalado:
node --version   # deve mostrar v18.x.x ou superior
npm --version    # deve mostrar 9.x.x ou superior
```

Se não tiver, baixe em: https://nodejs.org (instale a versão LTS)

### 2. Expo CLI (instalação global)

```bash
npm install -g expo-cli
```

### 3. Expo Go no seu celular

Instale o app **Expo Go** pela loja do seu dispositivo:

- 📱 Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- 🍎 iOS: [Apple App Store](https://apps.apple.com/app/expo-go/id982107779)

> **Celular e computador devem estar na mesma rede Wi-Fi!**

### 4. (Opcional) Emulador

- **Android**: Android Studio com um AVD configurado
- **iOS**: Xcode (somente macOS) com o iOS Simulator

---

## 📂 Estrutura do Projeto

```
exemploreact-native/
│
├── app/                          ← Telas do app (roteamento Expo Router)
│   ├── _layout.tsx               ← Layout raiz + configuração do Stack
│   ├── index.tsx                 ← Tela principal (lista de tarefas)
│   └── form.tsx                  ← Formulário de adicionar/editar
│
├── src/                          ← Código fonte da aplicação
│   ├── types/
│   │   └── task.ts               ← Interfaces e tipos TypeScript
│   ├── database/
│   │   ├── database.ts           ← Conexão com o SQLite (Singleton)
│   │   └── taskRepository.ts     ← Operações CRUD (Repository Pattern)
│   ├── hooks/
│   │   └── useTasks.ts           ← Hook customizado com lógica de negócio
│   └── components/
│       ├── TaskItem.tsx           ← Item individual da lista
│       ├── FilterBar.tsx          ← Barra de filtros (Todas/Pendentes/Concluídas)
│       └── EmptyState.tsx         ← Tela vazia com mensagem contextual
│
├── assets/                       ← Imagens, ícones, fontes
├── global.css                    ← Diretivas @tailwind (NativeWind)
├── tailwind.config.js            ← Configuração do Tailwind/NativeWind
├── babel.config.js               ← Configuração do transpilador Babel
├── metro.config.js               ← Configuração do bundler Metro
├── nativewind-env.d.ts           ← Tipos TypeScript para className
├── app.json                      ← Configuração do app Expo
├── tsconfig.json                 ← Configuração do TypeScript
└── package.json                  ← Dependências e scripts npm
```

---

## 🚀 Passo a Passo — Criando o Projeto do Zero

> Siga cada etapa na ordem. Ao final, você terá o app funcionando no seu celular!

---

### ETAPA 1 — Criar o projeto Expo

Abra o terminal na pasta onde deseja criar o projeto e execute:

```bash
npx create-expo-app@latest meu-lista-tarefas --template blank-typescript
```

Quando perguntar se pode instalar o `create-expo-app`, pressione `y` e Enter.

Após criar, entre na pasta:

```bash
cd meu-lista-tarefas
```

> **O que aconteceu?**  
> O `create-expo-app` criou um projeto React Native com TypeScript já configurado, com as dependências básicas do Expo instaladas.

---

### ETAPA 2 — Instalar as dependências

Instale os pacotes do Expo com versões compatíveis com o SDK 55:

```bash
npx expo install expo-router expo-sqlite expo-linking expo-constants expo-status-bar \
  react-native-screens react-native-safe-area-context \
  react-native-gesture-handler react-native-reanimated react-native-worklets
```

Instale o NativeWind e TailwindCSS:

```bash
npm install nativewind@^4.1 tailwindcss@^3.4 --legacy-peer-deps
```

> **Por que usamos `npx expo install` em vez de `npm install`?**  
> O `expo install` seleciona automaticamente as versões dos pacotes compatíveis com o SDK do seu projeto. Instalar a versão errada pode causar erros difíceis de diagnosticar!

> **O que é cada pacote?**
>
> - `expo-router` → navegação baseada em arquivos
> - `expo-sqlite` → banco de dados SQLite no dispositivo
> - `react-native-screens` → telas nativas de alta performance
> - `react-native-safe-area-context` → áreas seguras (evita notch)
> - `react-native-gesture-handler` → gestos (swipe, tap)
> - `react-native-reanimated` → animações performáticas
> - `react-native-worklets` → motor de threads para o Reanimated 4.x (peer dependency obrigatória)
> - `nativewind` → Tailwind CSS para React Native
> - `tailwindcss` → framework de estilos utilitários

---

### ETAPA 3 — Configurar o Expo Router

O Expo Router precisa ser definido como ponto de entrada no `package.json`. Abra o arquivo e **substitua** a linha:

```json
"main": "index.ts",
```

Por:

```json
"main": "expo-router/entry",
```

Também em `app.json`, adicione a propriedade `"scheme"` logo após `"version"`:

```json
{
  "expo": {
    "name": "meu-lista-tarefas",
    "slug": "meu-lista-tarefas",
    "version": "1.0.0",
    "scheme": "lista-tarefas",
    ...
  }
}
```

> **O que é o `scheme`?**  
> É o identificador usado para deep links — links que abrem diretamente uma tela específica do app (ex: `lista-tarefas://form?id=5`). O Expo Router usa isso internamente.

---

### ETAPA 4 — Configurar o NativeWind

**4.1 — Crie o arquivo `global.css`** na raiz do projeto:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**4.2 — Crie o arquivo `tailwind.config.js`** na raiz:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**4.3 — Crie o arquivo `babel.config.js`** na raiz:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      'react-native-reanimated/plugin', // DEVE ser o último!
    ],
  };
};
```

**4.4 — Crie o arquivo `metro.config.js`** na raiz:

```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```

**4.5 — Crie o arquivo `nativewind-env.d.ts`** na raiz:

```typescript
/// <reference types="nativewind/types" />
```

Este arquivo permite que o TypeScript reconheça a prop `className` nos componentes do React Native.

---

### ETAPA 5 — Criar os Tipos TypeScript

Dentro da pasta `src/types/`, crie o arquivo `task.ts`:

```typescript
// Interface que representa uma Tarefa no banco de dados
export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: number; // 0 = pendente, 1 = concluída
  createdAt: string; // formato ISO 8601
}

// Union type para os filtros disponíveis
export type TaskFilter = 'all' | 'pending' | 'completed';

// Dados para criar uma nova tarefa (sem id, completed e createdAt)
export interface CreateTaskInput {
  title: string;
  description: string | null;
}

// Dados para editar uma tarefa existente
export interface UpdateTaskInput {
  id: number;
  title: string;
  description: string | null;
}
```

> **Por que usar TypeScript?**  
> O TypeScript torna o código mais seguro. Se você tentar acessar `task.titulo` em vez de `task.title`, o editor vai avisar ANTES de você rodar o app. Isso economiza muito tempo de debugging!

---

### ETAPA 6 — Configurar o Banco de Dados SQLite

Crie `src/database/database.ts`:

```typescript
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'tasks.db';
let database: SQLite.SQLiteDatabase | null = null;

// Retorna a conexão com o banco, criando-a na primeira chamada (Singleton)
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (database !== null) {
    return database;
  }
  database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await runMigrations(database);
  return database;
}

// Cria as tabelas necessárias se ainda não existirem
async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT,
      completed   INTEGER NOT NULL DEFAULT 0,
      createdAt   TEXT    NOT NULL
    );
  `);
}
```

> **O que é o PRAGMA journal_mode = WAL?**  
> WAL (Write-Ahead Log) é um modo de operação do SQLite que melhora a performance de escritas. Em vez de gravar direto no arquivo, o SQLite usa um log intermediário. Isso reduz o tempo de travamento do banco durante escritas.

---

### ETAPA 7 — Criar o Repositório de Tarefas

Crie `src/database/taskRepository.ts` com as operações CRUD:

```typescript
import { getDatabase } from './database';
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

// Busca todas as tarefas, da mais recente para a mais antiga
export async function getTasks(): Promise<Task[]> {
  const db = await getDatabase();
  return db.getAllAsync<Task>('SELECT * FROM tasks ORDER BY createdAt DESC');
}

// Busca uma tarefa específica pelo ID
export async function getTaskById(id: number): Promise<Task | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', id);
}

// Cria uma nova tarefa e retorna ela com o ID gerado
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO tasks (title, description, completed, createdAt) VALUES (?, ?, 0, ?)',
    input.title,
    input.description,
    createdAt,
  );
  return (await getTaskById(result.lastInsertRowId))!;
}

// Atualiza título e descrição de uma tarefa
export async function updateTask(input: UpdateTaskInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
    input.title,
    input.description,
    input.id,
  );
}

// Alterna o status de conclusão (recebe o NOVO valor: 0 ou 1)
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

// Remove uma tarefa permanentemente
export async function deleteTask(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
}
```

> **Por que separar o banco de dados em dois arquivos?**  
> `database.ts` cuida da CONEXÃO (como abrir o banco, criar tabelas).  
> `taskRepository.ts` cuida das OPERAÇÕES (o que fazer com os dados).  
> Essa separação segue o princípio de Responsabilidade Única (Single Responsibility Principle — SRP).

---

### ETAPA 8 — Criar o Hook Customizado

Crie `src/hooks/useTasks.ts`:

```typescript
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import * as TaskRepository from '../database/taskRepository';
import { Task, TaskFilter } from '../types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [loading, setLoading] = useState(true);

  // Carrega todas as tarefas do banco
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await TaskRepository.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recarrega sempre que a tela ganhar foco (ao voltar do formulário)
  useFocusEffect(loadTasks);

  // Filtra as tarefas no frontend conforme o filtro ativo
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return task.completed === 0;
    if (filter === 'completed') return task.completed === 1;
    return true;
  });

  const toggleTask = useCallback(
    async (id: number, currentCompleted: number) => {
      const newCompleted = currentCompleted === 0 ? 1 : 0;
      await TaskRepository.toggleTaskComplete(id, newCompleted);
      await loadTasks();
    },
    [loadTasks],
  );

  const removeTask = useCallback(
    async (id: number) => {
      await TaskRepository.deleteTask(id);
      await loadTasks();
    },
    [loadTasks],
  );

  return {
    tasks: filteredTasks,
    allTasksCount: tasks.length,
    pendingCount: tasks.filter((t) => t.completed === 0).length,
    completedCount: tasks.filter((t) => t.completed === 1).length,
    filter,
    loading,
    setFilter,
    toggleTask,
    removeTask,
  };
}
```

> **Por que `useCallback`?**  
> Sem `useCallback`, a função `loadTasks` seria recriada em CADA renderização do componente. Isso causaria um loop infinito com `useFocusEffect`, pois o efeito detectaria a mudança de referência e rodaria novamente, causando nova renderização, nova função, novo efeito... Para isso, `useCallback` mantém a mesma referência de memória entre renderizações.

---

### ETAPA 9 — Criar os Componentes

**9.1 — `src/components/EmptyState.tsx`**  
Exibe uma mensagem quando a lista está vazia:

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { TaskFilter } from '../types/task';

interface EmptyStateProps {
  filter: TaskFilter;
}

const MESSAGES: Record<
  TaskFilter,
  { emoji: string; title: string; subtitle: string }
> = {
  all: {
    emoji: '📋',
    title: 'Nenhuma tarefa ainda!',
    subtitle: 'Toque no botão + para adicionar sua primeira tarefa.',
  },
  pending: {
    emoji: '🎉',
    title: 'Tudo em dia!',
    subtitle: 'Não há tarefas pendentes. Que eficiência!',
  },
  completed: {
    emoji: '⏳',
    title: 'Nenhuma tarefa concluída',
    subtitle: 'Conclua algumas tarefas para vê-las aqui.',
  },
};

export function EmptyState({ filter }: EmptyStateProps) {
  const { emoji, title, subtitle } = MESSAGES[filter];
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="text-6xl mb-4">{emoji}</Text>
      <Text className="text-xl font-bold text-gray-700 text-center mb-2">
        {title}
      </Text>
      <Text className="text-sm text-gray-400 text-center leading-5">
        {subtitle}
      </Text>
    </View>
  );
}
```

**9.2 — `src/components/FilterBar.tsx`**  
Barra com os três filtros:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TaskFilter } from '../types/task';

// ... (veja o arquivo completo no repositório)
// Exibe três botões: Todas, Pendentes e Concluídas
// O botão ativo fica com fundo índigo e texto branco
```

**9.3 — `src/components/TaskItem.tsx`**  
Card de cada tarefa:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Task } from '../types/task';

// ... (veja o arquivo completo no repositório)
// Exibe: checkbox, título, descrição, data, botões editar/excluir
```

> Veja os arquivos completos no diretório `src/components/` — eles contêm comentários detalhados linha por linha!

---

### ETAPA 10 — Criar as Telas

**10.1 — `app/_layout.tsx`** — Layout raiz com Stack Navigator:

```tsx
import '../global.css'; // ⚠️ Deve ser a primeira importação!
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#4f46e5' },
        headerTintColor: '#ffffff',
      }}
    >
      <Stack.Screen name="index" options={{ title: '📋 Minhas Tarefas' }} />
      <Stack.Screen name="form" options={{ title: 'Nova Tarefa' }} />
    </Stack>
  );
}
```

**10.2 — `app/index.tsx`** — Tela principal com a lista, filtros e FAB:

```tsx
import React from "react";
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useTasks } from "../src/hooks/useTasks";
// ... componentes

export default function HomeScreen() {
  const { tasks, filter, loading, ... } = useTasks(); // Toda a lógica está no hook!
  // A tela só renderiza a UI com os dados que o hook fornece
}
```

**10.3 — `app/form.tsx`** — Formulário unificado de criar/editar:

```tsx
import { useLocalSearchParams, useNavigation } from 'expo-router';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id; // true se /form?id=5, false se apenas /form
  // ...
}
```

---

### ETAPA 11 — Executar o App

```bash
# Inicia o servidor de desenvolvimento
npx expo start
```

Você verá um QR Code no terminal. Escaneie com o app **Expo Go** no seu celular. O app carregará automaticamente!

**Teclas úteis no terminal:**
| Tecla | Ação |
|---|---|
| `a` | Abre no emulador Android |
| `i` | Abre no simulador iOS (macOS) |
| `r` | Recarrega o app |
| `j` | Abre o debugger JavaScript |
| `Ctrl+C` | Para o servidor |

---

## 🏗️ Arquitetura do Projeto

```
┌─────────────────────────────────────────────────┐
│                    TELAS (UI)                   │
│   app/index.tsx          app/form.tsx           │
│   (Lista de tarefas)     (Formulário add/edit)  │
└──────────────────┬──────────────────────────────┘
                   │ usa
┌──────────────────▼──────────────────────────────┐
│              HOOK CUSTOMIZADO                   │
│              src/hooks/useTasks.ts              │
│   (Estado, filtros, chamadas ao repositório)    │
└──────────────────┬──────────────────────────────┘
                   │ chama
┌──────────────────▼──────────────────────────────┐
│           REPOSITÓRIO (Camada de Dados)         │
│        src/database/taskRepository.ts           │
│   (getTasks, createTask, updateTask, delete...) │
└──────────────────┬──────────────────────────────┘
                   │ usa
┌──────────────────▼──────────────────────────────┐
│              BANCO DE DADOS (SQLite)            │
│           src/database/database.ts              │
│   (Conexão Singleton, Migrações, Tabelas)       │
└─────────────────────────────────────────────────┘
```

Esta arquitetura em camadas garante que cada parte do sistema tenha **uma única responsabilidade** clara:

- **Telas**: mostrar dados e capturar interações do usuário
- **Hook**: gerenciar estado e orquestrar operações
- **Repositório**: traduzir operações de negócio em SQL
- **Database**: conexão e estrutura do banco

---

## 🔍 Conceitos Chave Aprendidos

### React Native vs. React Web

No **React** web usamos `<div>`, `<p>`, `<button>`. No **React Native** usamos primitivos nativos:

- `<View>` → equivalente ao `<div>`
- `<Text>` → obrigatório para todo texto (não existe `<p>`, `<span>`)
- `<TouchableOpacity>` → botão com efeito de opacidade
- `<FlatList>` → lista virtualizada e performática
- `<TextInput>` → campo de texto editável

### NativeWind — Tailwind no Mobile

```tsx
// Em vez de StyleSheet:
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: 'white' } });
<View style={styles.container}>

// Com NativeWind:
<View className="flex-1 bg-white">
```

Classes mais usadas neste projeto:
| Classe | Equivalente CSS/RN |
|---|---|
| `flex-1` | `flex: 1` |
| `flex-row` | `flexDirection: 'row'` |
| `items-center` | `alignItems: 'center'` |
| `justify-center` | `justifyContent: 'center'` |
| `bg-indigo-600` | `backgroundColor: '#4f46e5'` |
| `text-white` | `color: 'white'` |
| `rounded-xl` | `borderRadius: 12` |
| `p-4` | `padding: 16` |
| `mx-4` | `marginHorizontal: 16` |

### Expo Router — File-Based Routing

```
app/
├── _layout.tsx   → Layout para todas as telas abaixo
├── index.tsx     → Rota "/"   (tela inicial)
├── form.tsx      → Rota "/form"
└── about.tsx     → Rota "/about" (se existisse)
```

### SQLite — Dados Locais Persistentes

```typescript
// Executar SQL sem retorno (DDL):
await db.execAsync('CREATE TABLE IF NOT EXISTS tasks (...)');

// Inserir/atualizar/deletar:
const result = await db.runAsync('INSERT INTO tasks (...) VALUES (?)', valor);
console.log(result.lastInsertRowId); // ID gerado

// Buscar múltiplas linhas:
const tarefas = await db.getAllAsync<Task>('SELECT * FROM tasks');

// Buscar uma linha:
const tarefa = await db.getFirstAsync<Task>(
  'SELECT * FROM tasks WHERE id = ?',
  1,
);
```

---

## � Solução de Problemas

### `Cannot find module 'react-native-worklets/plugin'`

```
Error: [BABEL]: Cannot find module 'react-native-worklets/plugin'
Require stack:
- .../node_modules/react-native-reanimated/plugin/index.js
```

**Causa:** A partir da versão 4.x, o `react-native-reanimated` separou o motor de _worklets_ (código que roda em threads nativas) em um pacote independente chamado `react-native-worklets`. Esse pacote é uma **peer dependency obrigatória**, mas não é instalado automaticamente.

**Solução:**

```bash
npx expo install react-native-worklets
```

Em seguida, reinicie o servidor limpando o cache:

```bash
npx expo start --clear
```

---

## �🚧 Desafios para Praticar

Depois de reproduzir o projeto, tente implementar estas melhorias:

1. **🌙 Tema escuro**: adicione suporte a modo escuro usando `useColorScheme` do React Native
2. **📅 Prazo de entrega**: adicione um campo de data limite para as tarefas
3. **🔔 Notificações**: use `expo-notifications` para lembrar tarefas pendentes
4. **🔀 Reordenação**: permita arrastar para reordenar tarefas com `react-native-draggable-flatlist`
5. **📊 Estatísticas**: crie uma tela com gráfico de produtividade usando `victory-native`
6. **☁️ Sincronização**: sincronize as tarefas com um backend usando `fetch` ou `axios`
7. **🔍 Busca**: adicione um campo de busca por título/descrição

---

## 📚 Recursos para Continuar Aprendendo

- [Documentação Oficial React Native](https://reactnative.dev/docs/getting-started)
- [Documentação Expo](https://docs.expo.dev)
- [Expo Router — Guia de Rotas](https://docs.expo.dev/router/introduction/)
- [NativeWind v4 — Getting Started](https://www.nativewind.dev/v4/getting-started/expo-router)
- [expo-sqlite — API Reference](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [TypeScript para Beginners (PT-BR)](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais na disciplina de Desenvolvimento para Dispositivos Móveis.  
Sinta-se livre para usar, modificar e distribuir para fins de aprendizado.
