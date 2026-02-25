/**
 * app/index.tsx — Tela Principal (Lista de Tarefas)
 *
 * No Expo Router, o arquivo `app/index.tsx` é automaticamente mapeado
 * para a rota raiz "/" — a primeira tela exibida ao abrir o app.
 *
 * Responsabilidades desta tela:
 * - Exibir a lista de tarefas com a barra de filtros
 * - Recarregar automaticamente ao ganhar foco (via useFocusEffect no hook)
 * - Navegar para a tela de formulário ao pressionar o FAB
 *
 * O que é FAB (Floating Action Button)?
 * ──────────────────────────────────────
 * Um botão circular flutuante, geralmente no canto inferior direito.
 * É o padrão de Material Design para a ação principal de uma tela.
 * Aqui, o FAB abre o formulário para adicionar uma nova tarefa.
 *
 * Componentes React Native usados:
 * ─────────────────────────────────
 * - `FlatList`: renderiza listas de forma eficiente com virtualização.
 *   Diferente do `ScrollView + map()`, o FlatList só renderiza os itens
 *   visíveis na tela, o que é essencial para listas longas.
 *
 * - `ActivityIndicator`: spinner de carregamento nativo do dispositivo.
 *
 * - `SafeAreaView`: (via contentStyle no layout) garante que o conteúdo
 *   não fica atrás do notch ou canto arredondado em iPhones modernos.
 */

import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useTasks } from '../src/hooks/useTasks';
import { TaskItem } from '../src/components/TaskItem';
import { FilterBar } from '../src/components/FilterBar';
import { EmptyState } from '../src/components/EmptyState';

/**
 * Tela principal com a lista de tarefas.
 *
 * Toda a lógica de negócio (carregar, filtrar, toggle, deletar) está
 * encapsulada no hook `useTasks`. Este componente só cuida da UI.
 * Isso é um exemplo do princípio de Separação de Responsabilidades (SoC).
 */
export default function HomeScreen() {
  const router = useRouter();

  // Desestrutura tudo que o hook expõe — veja src/hooks/useTasks.ts
  const {
    tasks,
    allTasksCount,
    pendingCount,
    completedCount,
    filter,
    loading,
    setFilter,
    toggleTask,
    removeTask,
  } = useTasks();

  // ─────────────────────────────────────────────────────────────────────────
  // ESTADO DE CARREGAMENTO
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Enquanto os dados estão sendo buscados do SQLite, exibimos um spinner.
   * Isso evita que a tela mostre "vazia" por um instante antes de carregar.
   *
   * Retorno antecipado (early return): é uma boa prática retornar JSX
   * diferente com base em condições, em vez de aninhar muitos ternários.
   */
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-3 text-gray-500 text-sm">
          Carregando tarefas...
        </Text>
      </View>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDERIZAÇÃO PRINCIPAL
  // ─────────────────────────────────────────────────────────────────────────

  return (
    // `relative` é necessário para posicionar o FAB com `absolute` dentro
    <View className="flex-1 bg-gray-50 relative">
      {/* ── BARRA DE FILTROS ──────────────────────────────────────── */}
      <FilterBar
        activeFilter={filter}
        allCount={allTasksCount}
        pendingCount={pendingCount}
        completedCount={completedCount}
        onFilterChange={setFilter}
      />

      {/* ── LISTA DE TAREFAS ──────────────────────────────────────── */}
      {/*
       * FlatList é o componente de lista mais performático do React Native.
       *
       * Props principais:
       * - `data`: array de itens para renderizar
       * - `keyExtractor`: função que retorna uma key única para cada item
       *   (como o `key` do map() no React web). Usamos o `id` da tarefa.
       * - `renderItem`: função que recebe cada item e retorna o JSX
       * - `ListEmptyComponent`: renderizado quando `data` está vazio
       * - `contentContainerStyle`: estilo do container interno da lista
       * - `showsVerticalScrollIndicator`: oculta a barra de scroll vertical
       */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={toggleTask} onDelete={removeTask} />
        )}
        ListEmptyComponent={<EmptyState filter={filter} />}
        // Quando vazia: flex:1 para o EmptyState ocupar a tela toda
        // Quando com itens: padding para não ficar colado nas bordas
        contentContainerStyle={
          tasks.length === 0
            ? { flexGrow: 1 }
            : { paddingVertical: 8, paddingBottom: 100 }
        }
        showsVerticalScrollIndicator={false}
      />

      {/* ── FAB — BOTÃO FLUTUANTE DE ADICIONAR ───────────────────── */}
      {/*
       * `absolute bottom-8 right-6`: posição fixa no canto inferior direito.
       * `absolute` em React Native funciona igual ao CSS: posiciona o elemento
       * fora do fluxo normal, relativo ao pai com `relative` (ou à tela).
       *
       * `shadow-lg`: adiciona sombra para dar sensação de "flutuante".
       *
       * Ao pressionar, navega para a rota `/form` SEM parâmetro de ID,
       * o que indica à tela de formulário que é uma NOVA tarefa.
       */}
      <TouchableOpacity
        onPress={() => router.push('/form')}
        className="absolute bottom-8 right-6 w-16 h-16 bg-indigo-600 rounded-full items-center justify-center shadow-lg"
        accessibilityLabel="Adicionar nova tarefa"
        accessibilityRole="button"
      >
        {/* O "+" como símbolo visual — usando `text-3xl` para tamanho grande */}
        <Text
          className="text-white text-4xl font-light"
          style={{ lineHeight: 46 }}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}
