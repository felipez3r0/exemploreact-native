# 📋 Lista de Tarefas com React Native + Expo

> Repositório educacional da disciplina **Desenvolvimento para Dispositivos Móveis**  
> Fatec — Análise e Desenvolvimento de Sistemas

Um aplicativo completo de **Lista de Tarefas** construído com React Native e Expo, utilizando **SQLite** para persistência local de dados e **Firebase Authentication** para autenticação de usuários. Este projeto foi criado como guia prático para você aprender os conceitos fundamentais do desenvolvimento mobile com React Native.

---

## 🎯 O que você vai aprender

Ao estudar e reproduzir este projeto, você terá contato com:

- ⚛️ **React Native** e seus componentes principais (`View`, `Text`, `FlatList`, `TextInput`, etc.)
- 📱 **Expo SDK 55** e o ecossistema Expo
- 🗂️ **Expo Router** — roteamento baseado em arquivos (como Next.js para mobile)
- 🗄️ **expo-sqlite** — banco de dados local com SQL no dispositivo
- 🔐 **Firebase Authentication** — login com email/senha e Google Sign-In
- 🌐 **expo-auth-session** — fluxos OAuth 2.0 (Google, Facebook, etc.)
- 🎨 **NativeWind** — Tailwind CSS no React Native
- 🔷 **TypeScript** — tipagem estática para segurança e produtividade
- 🪝 **Custom Hooks** — separação de lógica com `useTasks`, `useProfile`, `useAuth`
- 🧩 **React Context API** — compartilhamento de estado global sem prop drilling
- 🏗️ **Boas práticas** — Repository Pattern, Separation of Concerns, Service Layer
- 📷 **expo-camera** — captura de fotos com a câmera do dispositivo
- 📁 **expo-file-system** — persistência de arquivos no armazenamento local
- 🔐 **Permissões de hardware** — como solicitar e tratar permissões em tempo de execução
- 🔒 **Proteção de rotas** — redirecionamento condicional baseado em autenticação
- 🌍 **Variáveis de ambiente** — usando .env com o prefixo `EXPO_PUBLIC_`

---

## 📱 Funcionalidades do App

| Funcionalidade                   | Descrição                                                   |
| -------------------------------- | ----------------------------------------------------------- |
| 🔐 **Autenticação**              |                                                             |
| &nbsp;&nbsp;📧 Login email/senha | Cadastro e login com Firebase Authentication                |
| &nbsp;&nbsp;🔍 Login Google      | OAuth 2.0 via Expo Auth Session (browser nativo)            |
| &nbsp;&nbsp;🚪 Logout            | Limpa sessão e redireciona para tela de login               |
| &nbsp;&nbsp;🔒 Rotas protegidas  | Redirecionamento automático se não autenticado              |
| **Tarefas**                      |                                                             |
| &nbsp;&nbsp;➕ Adicionar         | Título e descrição com validação                            |
| &nbsp;&nbsp;✅ Concluir          | Toggle de status com visual atualizado                      |
| &nbsp;&nbsp;✏️ Editar            | Edição de título e descrição                                |
| &nbsp;&nbsp;🗑️ Excluir           | Com confirmação de segurança                                |
| &nbsp;&nbsp;🔍 Filtrar           | Por: Todas / Pendentes / Concluídas                         |
| **Perfil**                       |                                                             |
| &nbsp;&nbsp;👤 Dados             | Nome, email e foto                                          |
| &nbsp;&nbsp;📷 Câmera            | Captura de foto com expo-camera                             |
| **Persistência**                 |                                                             |
| &nbsp;&nbsp;💾 Local (SQLite)    | Tarefas e perfil salvos localmente                          |
| &nbsp;&nbsp;☁️ Nuvem (Firebase)  | Token de autenticação persiste entre sessões (AsyncStorage) |

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
│   ├── _layout.tsx               ← Layout raiz + AuthProvider + proteção de rotas
│   ├── login.tsx                 ← Tela de login (email/senha + Google)
│   ├── register.tsx              ← Tela de cadastro (email/senha)
│   ├── index.tsx                 ← Tela principal (lista de tarefas)
│   ├── form.tsx                  ← Formulário de adicionar/editar
│   └── profile.tsx               ← Tela de perfil do usuário
│
├── src/                          ← Código fonte da aplicação
│   ├── types/
│   │   ├── task.ts               ← Interfaces e tipos TypeScript (tarefas)
│   │   ├── profile.ts            ← Interfaces e tipos TypeScript (perfil)
│   │   └── auth.ts               ← Interfaces e tipos TypeScript (autenticação)
│   ├── services/
│   │   └── firebaseConfig.ts     ← Configuração e inicialização do Firebase
│   ├── database/
│   │   ├── database.ts           ← Conexão com o SQLite (Singleton)
│   │   ├── taskRepository.ts     ← Operações CRUD (Repository Pattern - tasks)
│   │   └── profileRepository.ts  ← Operações CRUD (Repository Pattern - profile)
│   ├── contexts/
│   │   └── AuthContext.tsx       ← Contexto global de autenticação (React Context API)
│   ├── hooks/
│   │   ├── useTasks.ts           ← Hook customizado com lógica de negócio (tasks)
│   │   ├── useProfile.ts         ← Hook customizado com lógica de negócio (profile)
│   │   └── useAuth.ts            ← Hook customizado de autenticação (Firebase)
│   └── components/
│       ├── TaskItem.tsx           ← Item individual da lista
│       ├── FilterBar.tsx          ← Barra de filtros (Todas/Pendentes/Concluídas)
│       ├── EmptyState.tsx         ← Tela vazia com mensagem contextual
│       └── CameraCapture.tsx      ← Componente de captura de foto com câmera
│
├── assets/                       ← Imagens, ícones, fontes
├── .env                          ← Variáveis de ambiente (NÃO commitar!)
├── .env.example                  ← Modelo de variáveis de ambiente
├── global.css                    ← Diretivas @tailwind (NativeWind)
├── tailwind.config.js            ← Configuração do Tailwind/NativeWind
├── babel.config.js               ← Configuração do transpilador Babel
├── metro.config.js               ← Configuração do bundler Metro
├── nativewind-env.d.ts           ← Tipos TypeScript para className
├── app.json                      ← Configuração do app Expo
├── tsconfig.json                 ← Configuração do TypeScript
└── package.json                  ← Dependências e scripts npm
```

**Destaques da estrutura:**

- **`app/`** — Rotas baseadas em arquivos (Expo Router). Cada `.tsx` vira uma rota automaticamente.
- **`src/services/`** — Integrações com serviços externos (Firebase, APIs REST).
- **`src/contexts/`** — Contextos React para estado global (autenticação).
- **`src/hooks/`** — Lógica de negócio reutilizável extraída dos componentes.
- **`src/database/`** — Camada de acesso a dados local (SQLite).
- **`.env` / `.env.example`** — Variáveis de ambiente para configuração sensível.

---

├── assets/ ← Imagens, ícones, fontes
├── global.css ← Diretivas @tailwind (NativeWind)
├── tailwind.config.js ← Configuração do Tailwind/NativeWind
├── babel.config.js ← Configuração do transpilador Babel
├── metro.config.js ← Configuração do bundler Metro
├── nativewind-env.d.ts ← Tipos TypeScript para className
├── app.json ← Configuração do app Expo
├── tsconfig.json ← Configuração do TypeScript
└── package.json ← Dependências e scripts npm

````

---

## 🚀 Passo a Passo — Criando o Projeto do Zero

> Siga cada etapa na ordem. Ao final, você terá o app funcionando no seu celular!

---

### ETAPA 1 — Criar o projeto Expo

Abra o terminal na pasta onde deseja criar o projeto e execute:

```bash
npx create-expo-app@latest meu-lista-tarefas --template blank-typescript
````

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

Instale o `react-dom` — necessário para o `@expo/log-box` funcionar corretamente no bundler:

```bash
npx expo install react-dom
```

Instale o NativeWind e TailwindCSS:

```bash
npm install nativewind@^4.1 tailwindcss@^3.4 --legacy-peer-deps
```

Instale o `babel-preset-expo` como dependência de desenvolvimento:

```bash
npm install --save-dev babel-preset-expo
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
> - `react-dom` → necessário para o sistema de log overlay do Expo (`@expo/log-box`) resolver `react-dom/client` no bundler Metro
> - `nativewind` → Tailwind CSS para React Native
> - `tailwindcss` → framework de estilos utilitários
> - `babel-preset-expo` → preset do Babel configurado para projetos Expo (transpilação de código)

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

### ETAPA 12 — Instalar expo-camera e expo-file-system

Instale os pacotes necessários para captura de foto e manipulação de arquivos:

```bash
npx expo install expo-camera expo-file-system
```

> **O que são esses pacotes?**
>
> - `expo-camera` → acesso à câmera nativa do dispositivo (iOS e Android)
> - `expo-file-system` → leitura, escrita e cópia de arquivos no sistema

> **Compatibilidade com Expo Go:**  
> Ambos funcionam no **Expo Go** durante o desenvolvimento (permissão solicitada em tempo de execução).  
> Para builds de produção (standalone), nenhuma configuração adicional é necessária — o Expo configura automaticamente os plugins nativos!

---

### ETAPA 13 — Criar os Tipos do Perfil

Dentro da pasta `src/types/`, crie o arquivo `profile.ts`:

```typescript
/**
 * src/types/profile.ts — Definições de Tipos TypeScript para o módulo de Perfil
 */

// Interface que representa o perfil do usuário no banco de dados
export interface UserProfile {
  id: number; // Sempre 1 (registro único)
  name: string;
  email: string;
  photoUri: string | null; // Caminho local da foto ou null se não houver
}

// Dados necessários para salvar o perfil (criar ou atualizar)
export interface SaveProfileInput {
  name: string;
  email: string;
  photoUri: string | null;
}
```

> **Por que `photoUri` e não a imagem em Base64?**  
> Armazenar apenas o caminho (URI) do arquivo é mais eficiente:
>
> - Economiza espaço no banco (SQLite)
> - Evita carregar a imagem inteira na memória ao buscar o perfil
> - O componente `<Image source={{ uri }}>` aceita URIs de arquivo diretamente

> **Veja o arquivo completo com comentários educacionais em `src/types/profile.ts`!**

---

### ETAPA 14 — Expandir a Migração do Banco de Dados

Abra `src/database/database.ts` e adicione a criação da tabela `profile` na função `runMigrations`, **logo após a tabela `tasks`**:

```typescript
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

    -- Tabela de perfil do usuário (registro único com id fixo = 1)
    CREATE TABLE IF NOT EXISTS profile (
      id       INTEGER PRIMARY KEY,
      name     TEXT    NOT NULL DEFAULT '',
      email    TEXT    NOT NULL DEFAULT '',
      photoUri TEXT
    );
  `);
}
```

> **Por que `id` NÃO usa `AUTOINCREMENT`?**  
> Só existe UM perfil por app (id sempre = 1). O `AUTOINCREMENT` é útil para múltiplos registros (como tasks), mas aqui seria desnecessário e adicionaria sobrecarga.

> **Migração aditiva:**  
> `IF NOT EXISTS` garante que rodar a migração múltiplas vezes não quebra dados existentes. Se a tabela `tasks` já existe, ela não é recriada — só a `profile` é adicionada se não existir.

---

### ETAPA 15 — Criar o Repositório de Perfil

Crie `src/database/profileRepository.ts`:

```typescript
import { getDatabase } from './database';
import { UserProfile, SaveProfileInput } from '../types/profile';

// Busca o perfil do usuário
export async function getProfile(): Promise<UserProfile | null> {
  const db = await getDatabase();
  return db.getFirstAsync<UserProfile>(
    'SELECT * FROM profile WHERE id = 1 LIMIT 1',
  );
}

// Salva (cria ou atualiza) o perfil usando INSERT OR REPLACE (upsert)
export async function saveProfile(input: SaveProfileInput): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO profile (id, name, email, photoUri) VALUES (1, ?, ?, ?)',
    input.name,
    input.email,
    input.photoUri,
  );
}
```

> **O que é "upsert"?**  
> `INSERT OR REPLACE` = UPDATE + INSERT.  
> Se o registro com `id=1` não existe → insere.  
> Se já existe → substitui.  
> Isso elimina a necessidade de checar `IF EXISTS` no código.

> **Veja o arquivo completo com comentários extensivos em `src/database/profileRepository.ts`!**

---

### ETAPA 16 — Criar o Hook useProfile

Crie `src/hooks/useProfile.ts` seguindo o mesmo padrão de `useTasks.ts`:

```typescript
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import * as ProfileRepository from '../database/profileRepository';
import { UserProfile, SaveProfileInput } from '../types/profile';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProfileRepository.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const handleSave = useCallback(
    async (input: SaveProfileInput) => {
      await ProfileRepository.saveProfile(input);
      await loadProfile();
    },
    [loadProfile],
  );

  return { profile, loading, saveProfile: handleSave };
}
```

> **Comparação com `useTasks`:**  
> Ambos seguem o mesmo padrão arquitetural:
>
> - `useState` para armazenar dados
> - `useFocusEffect` para recarregar ao ganhar foco
> - `useCallback` para estabilizar referências de funções
> - Separação clara: hook = lógica, componente = UI

> **Veja o arquivo completo com comentários detalhados em `src/hooks/useProfile.ts`!**

---

### ETAPA 17 — Criar o Componente de Câmera

Crie `src/components/CameraCapture.tsx`:

Este componente encapsula toda a lógica de:

1. **Solicitação de permissões** (com hook `useCameraPermissions`)
2. **Três estados de UI**:
   - Verificando permissões
   - Permissão negada (tela explicativa + botão para Configurações)
   - Permissão concedida (preview da câmera)
3. **Captura da foto** usando `CameraView` + `useRef` + `takePictureAsync`

```typescript
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef } from 'react';
// ... (veja o arquivo completo no repositório)

export function CameraCapture({ onCapture, onClose }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const handleCapture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
    if (photo?.uri) onCapture(photo.uri);
  };

  // Renderização condicional por estado de permissão...
}
```

> **Fluxo de permissões:**
>
> 1. `permission === null` → Verificando...
> 2. `permission.granted === false` → Exibe tela explicativa com botão "Conceder Permissão"
> 3. `permission.granted === true` → Exibe o preview da câmera com botão de captura

> **Por que `useRef<CameraView>`?**  
> Para chamar métodos imperativos do componente `CameraView`, precisamos de uma referência direta. O `useRef` guarda um valor mutável que NÃO causa re-render quando muda.

> **Veja o arquivo completo com comentários extremamente detalhados em `src/components/CameraCapture.tsx`!**

---

### ETAPA 18 — Criar a Tela de Perfil

Crie `app/profile.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { File, Paths } from 'expo-file-system';
import { useProfile } from '../src/hooks/useProfile';
import { CameraCapture } from '../src/components/CameraCapture';

export default function ProfileScreen() {
  const { profile, loading, saveProfile } = useProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // Sincroniza estados locais quando o perfil carrega do banco
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhotoUri(profile.photoUri);
    }
  }, [profile]);

  // Copia a foto do URI temporário para o diretório permanente
  const handlePhotoCapture = async (tempUri: string) => {
    const fileName = `profile-${Date.now()}.jpg`;
    const destFile = new File(Paths.document, fileName);
    new File(tempUri).copy(destFile);
    setPhotoUri(destFile.uri);
    setShowCamera(false);
  };

  // Salva o perfil no banco
  const handleSave = async () => {
    await saveProfile({ name: name.trim(), email: email.trim(), photoUri });
    router.back();
  };

  // Renderiza formulário + CameraCapture condicional...
}
```

> **Por que copiar o arquivo?**  
> O URI retornado pela câmera (`expo-camera`) é **temporário** — o arquivo fica no cache e pode ser deletado pelo sistema a qualquer momento.  
> Usamos `new File(tempUri).copy(destFile)` (nova API do `expo-file-system`) para movê-lo para `Paths.document`, que é o armazenamento **permanente** do app.

> **`contentContainerClassName` vs `className` no ScrollView:**  
> `ScrollView` tem duas áreas de estilo:
>
> - `className`: aplica ao container que rola
> - `contentContainerClassName`: aplica ao conteÚDO dentro  
>   Use `contentContainerClassName` para padding/espaçamento interno!

> **Veja o arquivo completo com comentários extensivos em `app/profile.tsx`!**

---

### ETAPA 19 — Integrar o Perfil na Navegação

**19.1 — Registrar a rota no `_layout.tsx`:**

Adicione a tela `profile` no `<Stack>`:

```typescript
<Stack.Screen
  name="profile"
  options={{
    title: '👤 Meu Perfil',
  }}
/>
```

**19.2 — Adicionar botão de acesso no `index.tsx`:**

No início do componente, adicione `<Stack.Screen>` inline para customizar o header:

```typescript
import { Stack } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  // ...

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Text className="text-3xl">👤</Text>
            </TouchableOpacity>
          ),
        }}
      />
      {/* Restante da UI... */}
    </>
  );
}
```

> **Por que `<Stack.Screen>` inline e não no `_layout.tsx`?**  
> No `_layout.tsx` só temos opções **estáticas**.  
> O `headerRight` precisa acessar o `router` do componente para navegar — por isso definimos inline, com acesso ao escopo da tela.

---

## 🔐 Módulo de Autenticação com Firebase

As próximas etapas adicionam um sistema completo de autenticação usando **Firebase Authentication**, permitindo login com email/senha e Google Sign-In.

### ETAPA 20 — Instalar Dependências de Autenticação

Instale os pacotes do Firebase e do sistema de autenticação OAuth:

```bash
npm install firebase

npx expo install expo-auth-session expo-web-browser expo-crypto @react-native-async-storage/async-storage
```

> **O que cada pacote faz?**
>
> - `firebase` → SDK JavaScript do Firebase (autenticação, Firestore, Storage, etc.)
> - `expo-auth-session` → Gerencia fluxos OAuth 2.0 (login com Google, Facebook, etc.)
> - `expo-web-browser` → Abre o browser nativo para autenticação OAuth
> - `expo-crypto` → Funções criptográficas (dependência do expo-auth-session)
> - `@react-native-async-storage/async-storage` → Armazenamento local persistente (salva token de autenticação)

> **Por que Firebase JS SDK e não `@react-native-firebase`?**  
> O Firebase JS SDK funciona perfeitamente no Expo Go sem precisar de build nativo.  
> O pacote `@react-native-firebase` exige EAS Build (compilação nativa) — não roda no Expo Go.

---

### ETAPA 21 — Configurar Projeto no Firebase Console

**Esta etapa é MANUAL** — você precisará acessar o Firebase Console no navegador:

**21.1 — Criar projeto no Firebase:**

1. Acesse https://console.firebase.google.com
2. Clique em "Adicionar projeto"
3. Nome do projeto: `lista-tarefas-app` (ou qualquer nome)
4. Desabilite o Google Analytics (opcional para projetos educacionais)
5. Clique em "Criar projeto"

**21.2 — Registrar o app no Firebase:**

1. No painel do projeto, clique no ícone de código **</>** (Web)
2. Apelido do app: `Lista de Tarefas`
3. **NÃO** marque "Configure Firebase Hosting"
4. Clique em "Registrar app"
5. **COPIE** o objeto `firebaseConfig` que aparece na tela (você precisará dele na ETAPA 22)
6. Clique em "Continuar no console"

**21.3 — Habilitar Email/Password Authentication:**

1. No menu lateral, vá em **"Authentication"**
2. Clique em **"Começar"** (ou "Get Started")
3. Vá na aba **"Sign-in method"**
4. Clique em **"Email/Password"**
5. Ative a opção **"Email/Password"** (toggle para ON)
6. **NÃO** ative "E-mail link (passwordless sign-in)" por enquanto
7. Clique em **"Salvar"**

**21.4 — Habilitar Google Sign-In:**

1. Ainda na mesma tela (**Authentication > Sign-in method**)
2. Clique em **"Google"**
3. Ative o toggle **"Ativar"**
4. Em "Endereço de e-mail de suporte do projeto", selecione seu email
5. Clique em **"Salvar"**

**21.5 — Obter o Web Client ID do Google:**

1. Ainda na tela de configuração do Google (mantenha aberta)
2. Role para baixo até a seção **"Configurar SDK da Web"**
3. **COPIE** o valor do campo **"ID do cliente da Web"** (algo como `123456-abc.apps.googleusercontent.com`)
4. Salve esse valor — você precisará dele no `.env` na próxima etapa!

> **Importante sobre o Google Client ID:**  
> Este ID é para uso no **Expo Go** (ambiente de desenvolvimento).  
> Para builds de produção (APK/IPA), você precisará dos Client IDs de iOS e Android — veja a ETAPA 31.

---

### ETAPA 22 — Configurar Variáveis de Ambiente

**22.1 — Crie o arquivo `.env`** na raiz do projeto:

```bash
cp .env.example .env
```

Ou crie manualmente um arquivo `.env` com o seguinte conteúdo:

```env
# Firebase Config (obtenha em: Firebase Console > Configurações do Projeto > Seus Aplicativos)
EXPO_PUBLIC_FIREBASE_API_KEY=sua-api-key-aqui
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Google OAuth Client ID (Web) — para Expo Go (obtenha na ETAPA 21.5)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456-abc.apps.googleusercontent.com
```

**Substitua os valores** pelos da sua conta Firebase (copiados na ETAPA 21).

> **O que é `EXPO_PUBLIC_`?**  
> Desde o Expo SDK 49+, **toda variável de ambiente** com o prefixo `EXPO_PUBLIC_` é automaticamente carregada pelo Expo CLI e disponibilizada em `process.env`.  
> Sem esse prefixo, a variável NÃO seria acessível no código JavaScript.

> **Diferença entre buildtime e runtime:**  
> As variáveis `EXPO_PUBLIC_*` são substituídas em **tempo de BUILD** (quando o bundler Metro processa o código).  
> Se você mudar o `.env`, precisa **reiniciar o servidor** (`Ctrl+C` → `npx expo start`) para as mudanças aparecerem.

> **Por que .env não deve ser commitado no Git?**  
> O `.env` contém valores específicos do SEU projeto Firebase. Se outra pessoa clonar seu repositório, ela precisará criar o PRÓPRIO projeto Firebase e preencher com as chaves dela.  
> Por isso, o `.env` está no `.gitignore` e temos o `.env.example` (modelo sem valores reais) para documentar quais variáveis são necessárias.

**22.2 — Verificar se `.env` está no `.gitignore`:**

Abra `.gitignore` e confirme que há a linha:

```
.env
```

Se não houver, adicione-a manualmente.

**22.3 — Reiniciar o servidor de desenvolvimento:**

Pare o servidor (`Ctrl+C`) e reinicie para carregar as variáveis:

```bash
npx expo start
```

---

### ETAPA 23 — Criar os Tipos de Autenticação

Crie `src/types/auth.ts`:

```typescript
/**
 * Interface que representa o usuário autenticado.
 * Mapeado do objeto `User` do Firebase, contendo apenas as propriedades utilizadas.
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

/**
 * Interface de retorno do hook `useAuth`.
 */
export interface UseAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Tipo do contexto de autenticação (mesmo que UseAuthReturn).
 */
export type AuthContextType = UseAuthReturn;
```

> **Por que criar um tipo `AuthUser` personalizado?**  
> O Firebase retorna um objeto `User` com **mais de 30 propriedades** (refresh token, metadata, providers, etc.).  
> Na nossa UI, só usamos 4 campos. Mapear para nosso próprio tipo:
>
> - Simplifica o código (menos propriedades para lembrar)
> - Desacopla da implementação do Firebase (se mudarmos de provedor no futuro, só mudamos o hook)
> - Melhora a documentação (TypeScript mostra exatamente o que está disponível)

---

### ETAPA 24 — Criar o Serviço de Configuração do Firebase

**24.1 — Crie a pasta `src/services/`:**

```bash
mkdir src/services
```

**24.2 — Crie o arquivo `src/services/firebaseConfig.ts`:**

```typescript
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
```

> **Por que `initializeAuth` em vez de `getAuth`?**  
> No React Native, não existe `localStorage` (que o Firebase usa por padrão na web).  
> `initializeAuth` permite configurar um **adapter de persistência** personalizado.  
> Usamos `AsyncStorage` para salvar o token de autenticação no dispositivo — assim o usuário permanece logado mesmo após fechar o app!

> **Nova pasta `services/`:**  
> Até agora tínhamos `database/` (SQLite local) e `hooks/` (lógica de estado).  
> Agora adicionamos `services/` para código que **integra com serviços externos** (Firebase, APIs REST, etc.).  
> Isso mantém a separação de responsabilidades clara.

---

### ETAPA 25 — Criar o Hook useAuth

Crie `src/hooks/useAuth.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  type User,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../services/firebaseConfig';
import { AuthUser, UseAuthReturn } from '../types/auth';

WebBrowser.mayInitWithUrl();

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((error) => {
        console.error('Erro ao fazer login com Google:', error);
        alert('Erro ao fazer login com Google. Tente novamente.');
      });
    }
  }, [response]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        if (firebaseUser) {
          const mappedUser: AuthUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };
          setUser(mappedUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await firebaseSignIn(auth, email, password);
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      const message = getErrorMessage(error.code);
      throw new Error(message);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await firebaseSignUp(auth, email, password);
    } catch (error: any) {
      console.error('Erro ao criar conta:', error);
      const message = getErrorMessage(error.code);
      throw new Error(message);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!request) {
      alert('Configuração do Google ainda não está pronta. Aguarde...');
      return;
    }
    await promptAsync();
  }, [request, promptAsync]);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao sair. Tente novamente.');
    }
  }, []);

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
}

function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/user-not-found': 'Email não cadastrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/email-already-in-use': 'Este email já está em uso.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/invalid-email': 'Email inválido.',
    'auth/too-many-requests':
      'Muitas tentativas. Tente novamente mais tarde ou redefina sua senha.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  };

  return messages[code] || 'Erro ao processar sua solicitação.';
}
```

> **O que é `onAuthStateChanged`?**  
> É um **observador** do Firebase que dispara automaticamente quando:
>
> - O app inicia (verifica se há token salvo)
> - O usuário faz login
> - O usuário faz logout
> - O token expira e é renovado
>
> Isso elimina a necessidade de verificar manualmente o estado de autenticação!

> **Como funciona o Google Sign-In?**
>
> 1. `Google.useAuthRequest` configura o fluxo OAuth
> 2. `promptAsync()` abre o browser de autenticação
> 3. Usuário autoriza o app
> 4. O browser fecha e retorna com um `id_token`
> 5. Criamos uma credencial Firebase com esse token
> 6. Fazemos login no Firebase com `signInWithCredential`
> 7. `onAuthStateChanged` detecta o login e atualiza o estado

---

### ETAPA 26 — Criar o Contexto de Autenticação

**26.1 — Crie a pasta `src/contexts/`:**

```bash
mkdir src/contexts
```

**26.2 — Crie o arquivo `src/contexts/AuthContext.tsx`:**

```typescript
import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuthContext deve ser usado dentro de um <AuthProvider>. ' +
        'Verifique se o componente está envolvido pelo AuthProvider no _layout.tsx.'
    );
  }

  return context;
}

export default AuthProvider;
```

> **Por que usar Context em vez de chamar `useAuth()` diretamente?**  
> Se cada tela chamasse `useAuth()`, teríamos **múltiplos observadores** `onAuthStateChanged` (#rodando simultaneamente (ineficiente) e **estados separados** para cada tela (incorreto).  
> O Context garante que há **um único estado de autenticação** compartilhado por todas as telas.

> **Quando usar Context e quando usar hooks isolados?**
>
> | Situação                                       | Solução               | Exemplo no projeto               |
> | ---------------------------------------------- | --------------------- | -------------------------------- |
> | Múltiplas telas precisam do MESMO estado       | Context               | Autenticação (user)              |
> | Telas específicas precisam de dados diferentes | Hook isolado          | Tasks (index), Profile (profile) |
> | Estado que muda MUITO                          | Hook local (useState) | Campos de formulário             |

---

### ETAPA 27 — Atualizar o Layout com Proteção de Rotas

Modifique `app/_layout.tsx` para envolver o app no `AuthProvider` e implementar redirecionamento automático:

```typescript
import '../global.css';

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuthContext } from '../src/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { user, loading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      router.replace('/');
    }
  }, [user, loading, segments]);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#4f46e5' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: '#f9fafb' },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ title: '📋 Minhas Tarefas' }} />
      <Stack.Screen name="form" options={{ title: 'Nova Tarefa' }} />
      <Stack.Screen name="profile" options={{ title: '👤 Meu Perfil' }} />
    </Stack>
  );
}
```

> **Como funciona a proteção de rotas?**
>
> - Se `user === null` e rota não é `/login` nem `/register` → redireciona para `/login`
> - Se `user !== null` e rota é `/login` ou `/register` → redireciona para `/`
>
> Isso garante que usuários não autenticados **nunca** acessem as telas protegidas, e usuários já logados **não vejam** as telas de login.

> **Por que usar `router.replace()` em vez de `router.push()`?**  
> `replace()` **substitui** a rota atual no histórico, impedindo que o botão voltar leve o usuário de volta para a tela não autorizada (evita loops).

---

### ETAPA 28 — Criar a Tela de Login

Crie `app/login.tsx`:

```typescript
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../src/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { user, loading: authLoading, signIn, signInWithGoogle } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha email e senha.');
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim(), password);
    } catch (error: any) {
      Alert.alert('Erro ao fazer login', error.message || 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Erro ao fazer login com Google', error.message || 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-4 text-gray-600">Verificando autenticação...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-gray-50 px-6 justify-center">
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-800 mb-2">
              Bem-vindo! 👋
            </Text>
            <Text className="text-base text-gray-600">
              Faça login para acessar suas tarefas
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Senha</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            className={`rounded-xl py-4 mb-4 ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600'
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-center text-base font-semibold">
                Entrar
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">OU</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <TouchableOpacity
            className="bg-white border border-gray-300 rounded-xl py-4 mb-6 flex-row items-center justify-center"
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text className="text-2xl mr-3">🔍</Text>
            <Text className="text-gray-800 text-base font-semibold">
              Entrar com Google
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center">
            <Text className="text-gray-600 text-sm">Não tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => router.push('/register')}
              disabled={loading}
            >
              <Text className="text-indigo-600 text-sm font-semibold">
                Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

> **Por que `KeyboardAvoidingView`?**  
> No iOS, o teclado pode sobrepor os campos de input. Este componente ajusta automaticamente o layout, empurrando o conteúdo para cima quando o teclado aparece.

---

### ETAPA 29 — Criar a Tela de Cadastro

Crie `app/register.tsx`:

```typescript
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../src/contexts/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, loading: authLoading } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Senha muito curta',
        'A senha deve ter pelo menos 6 caracteres.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Senhas não coincidem', 'As senhas digitadas são diferentes.');
      return;
    }

    try {
      setLoading(true);
      await signUp(email.trim(), password);
    } catch (error: any) {
      Alert.alert('Erro ao criar conta', error.message || 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-4 text-gray-600">Verificando autenticação...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-gray-50 px-6 justify-center">
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-800 mb-2">
              Criar conta 🚀
            </Text>
            <Text className="text-base text-gray-600">
              Cadastre-se para começar a organizar suas tarefas
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Senha</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Confirmar senha
            </Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            className={`rounded-xl py-4 mb-6 ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600'
            }`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-center text-base font-semibold">
                Criar conta
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center">
            <Text className="text-gray-600 text-sm">Já tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text className="text-indigo-600 text-sm font-semibold">
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

> **Comportamento após cadastro:**  
> O Firebase **automaticamente faz login** após criar a conta com `createUserWithEmailAndPassword`.  
> O `onAuthStateChanged` detecta isso e atualiza o estado `user`, acionando o redirecionamento para `/` no `_layout.tsx`.

---

### ETAPA 30 — Adicionar Botão de Logout

Modifique `app/index.tsx` para adicionar o botão de logout ao header:

```typescript
// Adicione ao import do topo:
import { useAuthContext } from '../src/contexts/AuthContext';

// Dentro do componente, após o useRouter():
const { signOut } = useAuthContext();

// Modifique o Stack.Screen para incluir dois botões:
<Stack.Screen
  options={{
    headerRight: () => (
      <View className="flex-row gap-4">
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          accessibilityLabel="Abrir perfil"
          accessibilityRole="button"
        >
          <Text className="text-3xl">👤</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={signOut}
          accessibilityLabel="Sair"
          accessibilityRole="button"
        >
          <Text className="text-3xl">🚪</Text>
        </TouchableOpacity>
      </View>
    ),
  }}
/>
```

Agora o header da tela principal tem dois botões:

- **👤** (perfil) — navega para `/profile`
- **🚪** (sair) — faz logout e redireciona para `/login`

---

### ETAPA 31 — Google Sign-In para Produção (EAS Build)

**Esta etapa é OPCIONAL** — só é necessária se você for fazer um **build de produção** (APK/IPA) com EAS Build.  
No **Expo Go** (desenvolvimento com QR Code), apenas o Web Client ID (configurado na ETAPA 22) é suficiente.

**O que muda na produção?**

No Expo Go, o fluxo OAuth acontece no **browser** (como em um app web).  
Em builds nativos (APK/IPA), o Google SDK nativo é usado e exige **Client IDs específicos para cada plataforma** (iOS e Android).

**31.1 — Obter o iOS Client ID:**

1. No [Google Cloud Console](https://console.cloud.google.com), selecione seu projeto
2. Vá em **APIs e Serviços > Credenciais**
3. Clique em **Criar credenciais > ID do cliente OAuth 2.0**
4. Tipo de aplicativo: **iOS**
5. ID do pacote: use o valor de `ios.bundleIdentifier` do `app.json` (ex: `com.seuusuario.exemploreactnative`)
6. Clique em **Criar**
7. **COPIE** o "ID do cliente" gerado

**31.2 — Obter o Android Client ID:**

1. Ainda em **APIs e Serviços > Credenciais**
2. Clique em **Criar credenciais > ID do cliente OAuth 2.0**
3. Tipo de aplicativo: **Android**
4. Nome do pacote: use o valor de `android.package` do `app.json` (ex: `com.seuusuario.exemploreactnative`)
5. Certificado SHA-1: obtenha com `eas credentials` ou deixe em branco por enquanto (pode adicionar depois)
6. Clique em **Criar**
7. **COPIE** o "ID do cliente" gerado

**31.3 — Adicionar os Client IDs ao `.env`:**

```env
# Google OAuth Client IDs para builds de produção (EAS Build)
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=123456-ios.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=123456-android.apps.googleusercontent.com
```

**31.4 — Atualizar o hook `useAuth.ts`:**

Descomente as linhas de Client IDs no `Google.useAuthRequest`:

```typescript
const [request, response, promptAsync] = Google.useAuthRequest({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  // Para builds de produção (EAS), adicione:
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
});
```

Pronto! Agora o Google Sign-In funcionará tanto no Expo Go quanto em builds de produção.

> **Resumo das diferenças:**
>
> | Ambiente            | Client ID usado   | Fluxo OAuth       |
> | ------------------- | ----------------- | ----------------- |
> | Expo Go             | Web Client ID     | Abre o browser    |
> | Build iOS (EAS)     | iOS Client ID     | SDK Google nativo |
> | Build Android (EAS) | Android Client ID | SDK Google nativo |

---

## 🏗️ Arquitetura do Projeto

```
MÓDULO DE AUTENTICAÇÃO
┌───────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────┐   │
│  │    TELAS (UI)                                      │   │
│  │    app/login.tsx    app/register.tsx               │   │
│  │    (Login/Google)   (Cadastro)                     │   │
│  └────────────┬───────────────────────────────────────┘   │
│               │ usa                                        │
│  ┌────────────▼───────────────────────────────────────┐   │
│  │    CONTEXTO GLOBAL (React Context API)             │   │
│  │    src/contexts/AuthContext.tsx                    │   │
│  │    (Provê: user, signIn, signOut, etc.)            │   │
│  └────────────┬───────────────────────────────────────┘   │
│               │ usa                                        │
│  ┌────────────▼───────────────────────────────────────┐   │
│  │    HOOK CUSTOMIZADO                                │   │
│  │    src/hooks/useAuth.ts                            │   │
│  │    (Lógica: onAuthStateChanged, OAuth)             │   │
│  └────────────┬───────────────────────────────────────┘   │
│               │ chama                                      │
│  ┌────────────▼───────────────────────────────────────┐   │
│  │    SERVIÇO EXTERNO                                 │   │
│  │    src/services/firebaseConfig.ts                  │   │
│  │    (Inicializa Firebase + Auth)                    │   │
│  └────────────┬───────────────────────────────────────┘   │
│               │                                            │
└───────────────┼────────────────────────────────────────────┘
                │
                ▼
          FIREBASE AUTH (nuvem)
       ┌──────────────────────┐
       │ Email/Senha + Google │
       │ OAuth via browser    │
       └──────────────────────┘


MÓDULO DE TAREFAS              ┌───────────── MÓDULO DE PERFIL ───────────────┐
┌──────────────────────────────┤                                              │
│  ┌────────────────────────┐  │  ┌────────────────────────────────────────┐  │
│  │  TELAS (UI)            │  │  │  TELA (UI)                             │  │
│  │  app/index.tsx         │  │  │  app/profile.tsx                       │  │
│  │  app/form.tsx          │  │  │  (Nome, email, foto)                   │  │
│  └──────┬─────────────────┘  │  └────────────┬───────────────────────────┘  │
│         │ usa                │               │ usa                          │
│  ┌──────▼─────────────────┐  │  ┌────────────▼───────────────────────────┐  │
│  │  HOOK CUSTOMIZADO      │  │  │  HOOK CUSTOMIZADO                      │  │
│  │  src/hooks/useTasks.ts │  │  │  src/hooks/useProfile.ts               │  │
│  └──────┬─────────────────┘  │  └────────────┬───────────────────────────┘  │
│         │ chama              │               │ chama                        │
│  ┌──────▼─────────────────┐  │  ┌────────────▼───────────────────────────┐  │
│  │  REPOSITÓRIO           │  │  │  REPOSITÓRIO                           │  │
│  │  taskRepository.ts     │  │  │  profileRepository.ts                  │  │
│  └──────┬─────────────────┘  │  └────────────┬───────────────────────────┘  │
└─────────┼────────────────────┘               │                              │
          │                ┌───────────────────┼──────────────────────────────┘
          │                │                   │
       ┌──▼────────────────▼───────────────────▼──┐
       │      BANCO DE DADOS (SQLite)              │
       │      src/database/database.ts             │
       │  (Conexão Singleton, 2 Tabelas)           │
       │      • tasks (múltiplos registros)        │
       │      • profile (registro único)           │
       └───────────────────────────────────────────┘
```

### Arquitetura em Camadas com Três Módulos

Esta arquitetura demonstra **separação por módulos** e **reutilização de padrões**, agora com a adição do módulo de autenticação:

**Camadas (de cima para baixo):**

- **TELAS (UI)**: capturam interações e exibem dados — NÃO contêm lógica de negócio
- **CONTEXTO/HOOKS CUSTOMIZADOS**: gerenciam estado e orquestram operações — isolam lógica reutilizável
- **REPOSITÓRIOS/SERVIÇOS**: abstraem acesso a dados (SQLite local) ou serviços externos (Firebase)
- **DATABASE/FIREBASE**: pontos de persistência — local (SQLite) e nuvem (Firebase)

**Diferenças entre os módulos:**

| Aspecto                  | Autenticação                    | Tarefas/Perfil          |
| ------------------------ | ------------------------------- | ----------------------- |
| **Estado**               | Global (React Context)          | Local (hooks isolados)  |
| **Fonte de dados**       | Firebase (nuvem)                | SQLite (local)          |
| **Camada intermediária** | Service (firebaseConfig)        | Repository (SQL)        |
| **Recarregamento**       | Automático (onAuthStateChanged) | Manual (useFocusEffect) |

**Por que autenticação usa Context e tasks/profile não?**

- **Autenticação**: TODAS as telas precisam saber se o usuário está logado (para proteção de rotas). Estado global faz sentido.
- **Tasks/Profile**: apenas telas ESPECÍFICAS precisam desses dados. Hooks isolados com `useFocusEffect` funcionam perfeitamente.

**Vantagens desta arquitetura:**

- ✅ **Testabilidade**: cada camada pode ser testada isoladamente
- ✅ **Manutenibilidade**: mudanças em uma camada não afetam as outras
- ✅ **Reutilização**: mesmo padrão repetido em Tarefas e Perfil
- ✅ **Escalabilidade**: adicionar novo módulo (ex: Configurações) segue o mesmo template

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

### expo-camera — Acesso ao Hardware do Dispositivo

O `expo-camera` permite acessar a câmera nativa (iOS e Android) via JavaScript, com gerenciamento de permissões integrado.

**Hook de permissões:**

```typescript
const [permission, requestPermission] = useCameraPermissions();

if (!permission) return <Text>Verificando...</Text>;
if (!permission.granted) {
  return <Button onPress={requestPermission}>Conceder Permissão</Button>;
}
```

**Fluxo de estados:**

1. `null` → ainda não verificou (inicial)
2. `granted: false` → usuário negou ou ainda não respondeu
3. `granted: true` → pode acessar a câmera

**Captura de foto com referência:**

```typescript
const cameraRef = useRef<CameraView>(null);

<CameraView ref={cameraRef} facing="back">
  <Button onPress={async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
    console.log(photo.uri); // URI temporário do arquivo
  }} />
</CameraView>
```

**Importante:** O URI retornado é **temporário** (no cache) — use `expo-file-system` para copiar para local permanente!

---

### expo-file-system — Manipulação de Arquivos Permanentes

O `expo-file-system` fornece APIs orientadas a objetos para ler, escrever, copiar e deletar arquivos no sistema de arquivos do dispositivo.

> **Expo SDK 55 — Nova API (`File` e `Paths`)**  
> A partir do SDK 55 o `expo-file-system` expõe uma API baseada em classes. Importe `File` e `Paths` em vez do namespace legado `FileSystem.*`.

**Import:**

```typescript
import { File, Paths } from 'expo-file-system';
```

**Diretórios principais via `Paths`:**

```typescript
Paths.document; // Permanente: sobrevive até desinstalar o app
// iOS: /var/mobile/.../Documents/
// Android: /data/user/0/.../files/

Paths.cache; // Temporário: pode ser limpo pelo sistema
// iOS: /var/mobile/.../Library/Caches/
// Android: /data/user/0/.../cache/
```

**Copiar arquivo (ex: foto da câmera):**

```typescript
const tempUri = 'file:///cache/Camera/photo-123.jpg'; // URI temporário
const fileName = `profile-${Date.now()}.jpg`;

// Cria uma referência ao arquivo de destino (permanente)
const destFile = new File(Paths.document, fileName);

// Copia do cache temporário para o diretório permanente
new File(tempUri).copy(destFile);

// Agora salve `destFile.uri` no SQLite — ele sobrevive ao fechar o app!
```

**Por que copiar em vez de usar direto o URI temporário?**

- ❌ URIs da câmera são voláteis (sistema pode deletar a qualquer momento)
- ✅ `Paths.document` garante persistência até o app ser desinstalado
- ✅ Permite controle total sobre quando deletar arquivos antigos

**Outras operações úteis:**

```typescript
// Ler arquivo como string
const file = new File(Paths.document, 'dados.txt');
const content = await file.text();

// Escrever arquivo
await file.write('conteúdo');

// Verificar se existe
console.log(file.exists); // boolean

// Deletar arquivo
file.delete();
```

---

## 🔧 Solução de Problemas

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
