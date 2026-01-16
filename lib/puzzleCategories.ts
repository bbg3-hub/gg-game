import { PuzzleCategory, EducationalPuzzle } from './educationalPuzzles';

export interface PuzzleCategoryConfig {
  id: PuzzleCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const PUZZLE_CATEGORIES: PuzzleCategoryConfig[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: '🔢',
    description: 'Arithmetic, algebra, geometry, and real-world math applications',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: '⚛️',
    description: 'Forces, motion, energy, and scientific principles',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: '🧪',
    description: 'Molecules, reactions, concentrations, and solutions',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'cooking',
    name: 'Cooking',
    icon: '🍳',
    description: 'Recipes, nutrition, food science, and meal planning',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    description: 'Money management, investments, and budgeting',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    icon: '💪',
    description: 'Body metrics, exercise, and nutrition',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 'time',
    name: 'Time & Scheduling',
    icon: '⏰',
    description: 'Time management, calendars, and planning',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'statistics',
    name: 'Statistics',
    icon: '📊',
    description: 'Data analysis, probability, and averages',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'gardening',
    name: 'Gardening',
    icon: '🌱',
    description: 'Plants, soil, and outdoor spaces',
    color: 'from-lime-500 to-green-500',
  },
  {
    id: 'home',
    name: 'Home Improvement',
    icon: '🔧',
    description: 'Repairs, renovation, and maintenance',
    color: 'from-amber-500 to-yellow-500',
  },
];

export const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Easy', color: 'text-green-400', bg: 'bg-green-900' },
  { id: 'medium', name: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-900' },
  { id: 'hard', name: 'Hard', color: 'text-red-400', bg: 'bg-red-900' },
] as const;

export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number]['id'];

export function getCategoryInfo(category: PuzzleCategory): PuzzleCategoryConfig | undefined {
  return PUZZLE_CATEGORIES.find(c => c.id === category);
}

export function getCategoryColor(category: PuzzleCategory): string {
  return PUZZLE_CATEGORIES.find(c => c.id === category)?.color || 'from-gray-500 to-gray-600';
}

export function getDifficultyInfo(difficulty: DifficultyLevel) {
  return DIFFICULTY_LEVELS.find(d => d.id === difficulty) || DIFFICULTY_LEVELS[0];
}

export function filterPuzzles(
  puzzles: EducationalPuzzle[],
  filters: {
    categories?: PuzzleCategory[];
    difficulties?: DifficultyLevel[];
    search?: string;
  }
): EducationalPuzzle[] {
  return puzzles.filter(puzzle => {
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(puzzle.category)) return false;
    }
    if (filters.difficulties && filters.difficulties.length > 0) {
      if (!filters.difficulties.includes(puzzle.difficulty)) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !puzzle.title.toLowerCase().includes(searchLower) &&
        !puzzle.problem.toLowerCase().includes(searchLower) &&
        !puzzle.realWorldContext.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });
}

export function getPuzzleStats(puzzles: EducationalPuzzle[]) {
  const stats = {
    total: puzzles.length,
    byCategory: {} as Record<PuzzleCategory, number>,
    byDifficulty: { easy: 0, medium: 0, hard: 0 },
  };

  puzzles.forEach(puzzle => {
    stats.byCategory[puzzle.category] = (stats.byCategory[puzzle.category] || 0) + 1;
    stats.byDifficulty[puzzle.difficulty]++;
  });

  return stats;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generatePuzzleBatch(
  puzzles: EducationalPuzzle[],
  count: number,
  options?: {
    categories?: PuzzleCategory[];
    difficulties?: DifficultyLevel[];
    excludeIds?: string[];
  }
): EducationalPuzzle[] {
  let available = puzzles;

  if (options?.categories && options.categories.length > 0) {
    available = available.filter(p => options.categories!.includes(p.category));
  }

  if (options?.difficulties && options.difficulties.length > 0) {
    available = available.filter(p => options.difficulties!.includes(p.difficulty));
  }

  if (options?.excludeIds && options.excludeIds.length > 0) {
    available = available.filter(p => !options.excludeIds!.includes(p.id));
  }

  return shuffleArray(available).slice(0, Math.min(count, available.length));
}
