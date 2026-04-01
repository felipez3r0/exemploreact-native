/**
 * src/services/firebaseConfig.ts — Configuração e Inicialização do Firebase
 *
 * Este arquivo centraliza a configuração do Firebase para o aplicativo.
 * Ele é importado por TODOS os módulos que precisam acessar o Firebase Auth.
 *
 * Nova pasta `services/`:
 * ───────────────────────
 * Até agora, tínhamos:
 * - `database/` → acesso ao SQLite LOCAL
 * - `hooks/` → lógica reutilizável de estado
 * - `types/` → contratos de dados
 *
 * Agora adicionamos:
 * - `services/` → integração com SERVIÇOS EXTERNOS (Firebase, APIs REST, etc.)
 *
 * Esta pasta é o lugar certo para código que se comunica com o mundo externo.
 *
 * Por que usar variáveis de ambiente?
 * ───────────────────────────────────
 * As chaves da API do Firebase são PÚBLICAS (aparecem no código do app), mas
 * devem ser protegidas por regras de segurança no Firebase Console. Mesmo assim,
 * é boa prática:
 * 1. NÃO commitar as chaves no Git (arquivo .env no .gitignore)
 * 2. Usar .env.example para documentar quais variáveis são necessárias
 * 3. Permitir diferentes configurações para dev/staging/prod sem mudar código
 *
 * Convenção EXPO_PUBLIC_*:
 * ────────────────────────
 * O Expo CLI (desde SDK 49+) carrega automaticamente variáveis do arquivo .env
 * que começam com `EXPO_PUBLIC_`. Elas ficam disponíveis em `process.env`.
 *
 * ⚠️ IMPORTANTE: são substituídas em TEMPO DE BUILD (não runtime).
 * Mudar o .env exige reiniciar o servidor de desenvolvimento (npx expo start).
 *
 * Alternativa sem EXPO_PUBLIC_:
 * ──────────────────────────────
 * Se usar `API_KEY=xxx` (sem prefixo), o Expo CLI NÃO carrega automaticamente.
 * Precisaríamos do pacote `babel-plugin-inline-dotenv` ou `react-native-dotenv`.
 * Com `EXPO_PUBLIC_`, funciona out-of-the-box — zero configuração extra!
 *
 * initializeAuth vs. getAuth:
 * ───────────────────────────
 * No React NATIVE, NÃO podemos usar `getAuth()` diretamente como na web.
 * Precisamos de `initializeAuth` com um adapter de persistência.
 *
 * Por quê?
 * ────────
 * `getAuth()` assume que existe `localStorage` no ambiente (web).
 * React Native não tem `localStorage` — usamos `AsyncStorage`.
 *
 * `initializeAuth` permite configurar ONDE o Firebase salva o token de sessão:
 * - Web: localStorage (padrão)
 * - React Native: AsyncStorage (via `getReactNativePersistence`)
 *
 * Benefício da persistência:
 * ──────────────────────────
 * O usuário faz login → token salvo no AsyncStorage → fecha o app →
 * abre novamente → token carregado automaticamente → continua logado! 🎉
 */

import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Configuração do Firebase.
 *
 * Estes valores são obtidos no Firebase Console:
 * 1. Acesse https://console.firebase.google.com
 * 2. Selecione seu projeto (ou crie um novo)
 * 3. Vá em "Configurações do projeto" (ícone de engrenagem)
 * 4. Role até "Seus aplicativos" → clique no ícone de código </> (web)
 * 5. Copie o objeto `firebaseConfig`
 *
 * ⚠️ ATENÇÃO: as variáveis vêm do arquivo .env (não commitado no Git).
 * Se você acabou de clonar este projeto, copie .env.example para .env
 * e preencha com os valores REAIS do seu projeto Firebase.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Inicializa o Firebase App.
 *
 * `initializeApp` DEVE ser chamado UMA ÚNICA VEZ na aplicação.
 * Se chamar múltiplas vezes, o Firebase lança um erro:
 * "Firebase App named '[DEFAULT]' already exists".
 *
 * Por isso este arquivo exporta instâncias já inicializadas — outros
 * módulos importam `auth` pronto para uso, sem risco de duplicação.
 */
const app = initializeApp(firebaseConfig);

/**
 * Inicializa o Firebase Auth com persistência via AsyncStorage.
 *
 * `getReactNativePersistence(AsyncStorage)`:
 * ──────────────────────────────────────────
 * Configura o Firebase para salvar o token de autenticação no AsyncStorage
 * do React Native. Isso permite que o usuário permaneça logado mesmo após
 * fechar o app.
 *
 * Fluxo de persistência:
 * ──────────────────────
 * 1. Usuário faz login → Firebase gera um token (JWT)
 * 2. Firebase salva o token no AsyncStorage (chave: `firebase:authUser:[...]`)
 * 3. App é fechado
 * 4. App é reaberto → Firebase tenta ler o token do AsyncStorage
 * 5. Se o token existe e é válido → restaura a sessão automaticamente
 * 6. Se o token expirou ou não existe → usuário precisa fazer login
 *
 * ⚠️ IMPORTANTE: esta abordagem é segura?
 * ────────────────────────────────────────
 * SIM. O AsyncStorage do React Native é isolado por app (sandbox).
 * Nenhum outro aplicativo pode ler os dados salvos pelo seu app.
 * Além disso, o token JWT tem expiração (padrão: 1 hora), e o Firebase
 * usa refresh tokens para renovar automaticamente.
 */
export const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

/**
 * Exporta a instância do Firebase App (caso seja necessária no futuro).
 *
 * Por enquanto, só usamos o `auth`. Mas se no futuro adicionarmos
 * Firestore, Storage ou outras funcionalidades do Firebase, podemos
 * importar `app` e inicializar esses serviços a partir dele.
 *
 * Exemplo futuro:
 * ───────────────
 * import { app } from './firebaseConfig';
 * import { getFirestore } from 'firebase/firestore';
 * export const db = getFirestore(app);
 */
export default app;
