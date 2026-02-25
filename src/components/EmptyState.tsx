/**
 * src/components/EmptyState.tsx — Componente de Estado Vazio
 *
 * O que é "Estado Vazio" (Empty State)?
 * ───────────────────────────────────────
 * É a tela exibida quando uma lista não tem dados para mostrar.
 * Em vez de mostrar nada (o que confunde o usuário), apresentamos
 * uma mensagem amigável e contextual.
 *
 * Boas práticas de UX para empty states:
 * ✅ Explique POR QUE está vazio (contexto)
 * ✅ Sugira uma ação para o usuário tomar
 * ✅ Use ícone/ilustração para tornar visualmente agradável
 *
 * Conceitos React Native usados:
 * - `View`: container sem renderização visual própria (como uma <div>)
 * - `Text`: componente para exibir textos (sem ele, nada de texto no RN!)
 *
 * Conceitos TypeScript usados:
 * - `Record<K, V>`: tipo utilitário — objeto com chaves do tipo K e valores do tipo V
 *   Aqui: `Record<TaskFilter, {...}>` garante que existe uma mensagem para CADA filtro
 */

import React from 'react';
import { View, Text } from 'react-native';
import { TaskFilter } from '../types/task';

// =============================================================================
// TIPOS DAS PROPS
// =============================================================================

/**
 * Props do componente EmptyState.
 *
 * Uma "prop" (propriedade) é como passamos dados de um componente pai para
 * um componente filho. É o mecanismo de comunicação pai → filho no React.
 */
interface EmptyStateProps {
  /** Filtro atualmente ativo — determina qual mensagem exibir */
  filter: TaskFilter;
}

// =============================================================================
// DADOS DAS MENSAGENS
// =============================================================================

/**
 * Mapeamento de filtro → mensagem exibida.
 *
 * `Record<TaskFilter, ...>` garante que cada valor de TaskFilter
 * tem uma entrada neste objeto. Se adicionarmos um novo filtro ao tipo
 * TaskFilter sem adicionar aqui, o TypeScript avisará com erro.
 *
 * Definir dados fora do componente evita recriar o objeto a cada render.
 */
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

// =============================================================================
// COMPONENTE
// =============================================================================

/**
 * Exibe uma mensagem amigável quando a lista de tarefas está vazia.
 *
 * A mensagem muda conforme o filtro ativo — se o usuário filtrou por
 * "Concluídas" e não tem nenhuma, mostramos uma mensagem específica.
 *
 * @param props.filter O filtro ativo na tela principal
 */
export function EmptyState({ filter }: EmptyStateProps) {
  // Desestrutura o objeto de mensagem para o filtro atual
  const { emoji, title, subtitle } = MESSAGES[filter];

  return (
    // `flex-1` faz o container ocupar todo o espaço disponível
    // `items-center justify-center` centraliza horizontal e verticalmente
    <View className="flex-1 items-center justify-center px-8 py-16">
      {/* Emoji grande como "ilustração" simples */}
      <Text className="text-6xl mb-4">{emoji}</Text>

      {/* Título da mensagem */}
      <Text className="text-xl font-bold text-gray-700 text-center mb-2">
        {title}
      </Text>

      {/* Subtítulo com instrução */}
      <Text className="text-sm text-gray-400 text-center leading-5">
        {subtitle}
      </Text>
    </View>
  );
}
