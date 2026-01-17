// Mini-game data structures and definitions
export type MiniGameType = 
  | 'click-targets'
  | 'memory-match'
  | 'sequence-puzzle'
  | 'timing-challenge'
  | 'pattern-recognition'
  | 'math-mini-game'
  | 'sorting-game'
  | 'reaction-test';

export interface MiniGameAsset {
  id: string;
  type: 'image' | 'audio';
  url: string;
  name: string;
  size: number;
  uploadedAt: number;
}

export interface BaseMiniGameConfig {
  id: string;
  title: string;
  description: string;
  type: MiniGameType;
  difficulty: number; // 1-10
  timeLimit?: number; // seconds
  maxAttempts?: number;
  scoringSystem: {
    basePoints: number;
    timeMultiplier?: boolean;
    difficultyBonus?: boolean;
    bonusConditions?: string[];
    penaltyConditions?: string[];
  };
  visualTheme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    fontFamily?: string;
    customCSS?: string;
  };
  sounds: {
    success?: string;
    failure?: string;
    click?: string;
    timer?: string;
    bonus?: string;
  };
  assets: MiniGameAsset[];
  successThreshold: number; // percentage or count
  failureThreshold?: number;
  createdAt: number;
  updatedAt: number;
  published: boolean;
}

// Click Targets Game
export interface ClickTargetsConfig extends BaseMiniGameConfig {
  type: 'click-targets';
  config: {
    targetCount: number;
    targetSize: number; // pixels
    moveSpeed: number; // 1-10
    targetColor: string;
    targetShape: 'circle' | 'square' | 'random';
    comboScoring: boolean;
    movingTargets: boolean;
    spawnRate: number; // targets per second
    wrongClickPenalty: number;
    perfectHitBonus: number;
  };
}

// Memory Match Game
export interface MemoryMatchConfig extends BaseMiniGameConfig {
  type: 'memory-match';
  config: {
    gridSize: '2x2' | '4x4' | '6x6';
    cards: {
      id: string;
      image: string;
      matchId: string;
    }[];
    flipTime: number; // seconds before auto-flip back
    showAllTime?: number; // initial reveal time
    perfectMatchBonus: number;
    timePenalty: number; // seconds added per wrong attempt
  };
}

// Sequence Puzzle
export interface SequencePuzzleConfig extends BaseMiniGameConfig {
  type: 'sequence-puzzle';
  config: {
    sequenceLength: number;
    sequenceType: 'colors' | 'numbers' | 'shapes' | 'audio';
    sequence: (string | number)[];
    showTime: number; // seconds to show sequence
    inputTime: number; // seconds to input
    allowMultipleAttempts: boolean;
    hintSystem: boolean;
    difficultyVariants: {
      length: number;
      sequence: (string | number)[];
    }[];
  };
}

// Timing Challenge
export interface TimingChallengeConfig extends BaseMiniGameConfig {
  type: 'timing-challenge';
  config: {
    timingWindows: {
      perfect: number; // ms window for perfect timing
      good: number; // ms window for good timing
      acceptable: number; // ms window for acceptable timing
    };
    stimulusType: 'visual' | 'audio' | 'both';
    variableDelay: boolean;
    minDelay: number; // ms
    maxDelay: number; // ms
    progressiveDifficulty: boolean;
    earlyPenalty: number;
    latePenalty: number;
  };
}

// Pattern Recognition
export interface PatternRecognitionConfig extends BaseMiniGameConfig {
  type: 'pattern-recognition';
  config: {
    patternType: 'geometric' | 'numerical' | 'logical' | 'visual';
    gridSize: '3x3' | '4x4' | '5x5';
    patterns: {
      id: string;
      grid: number[][];
      solution: string;
      difficulty: number;
    }[];
    showTime: number; // seconds to study pattern
    recognitionTime: number; // seconds to identify
    hintSystem: boolean;
  };
}

// Math Mini-Game
export interface MathMiniGameConfig extends BaseMiniGameConfig {
  type: 'math-mini-game';
  config: {
    operations: ('addition' | 'subtraction' | 'multiplication' | 'division' | 'percentage' | 'square-root')[];
    numberRange: {
      min: number;
      max: number;
    };
    problemCount: number;
    timePerProblem: number; // seconds
    difficultyScaling: boolean;
    customProblems?: {
      question: string;
      answer: number;
      options?: number[];
    }[];
  };
}

// Sorting Game
export interface SortingGameConfig extends BaseMiniGameConfig {
  type: 'sorting-game';
  config: {
    items: {
      id: string;
      name: string;
      value: string | number;
      image?: string;
    }[];
    sortingRule: 'numerical' | 'alphabetical' | 'custom' | 'size' | 'color';
    dragAndDrop: boolean;
    undoLimit: number;
    timeLimit: number;
    verificationLogic: string; // how to verify correct order
  };
}

// Reaction Test
export interface ReactionTestConfig extends BaseMiniGameConfig {
  type: 'reaction-test';
  config: {
    stimulusType: 'visual' | 'audio' | 'both';
    reactionTrials: number;
    variableDelays: boolean;
    minDelay: number; // ms
    maxDelay: number; // ms
    falseStartPenalty: boolean;
    averageCalculation: boolean;
    feedback: 'immediate' | 'end' | 'none';
  };
}

export type MiniGameConfig = 
  | ClickTargetsConfig
  | MemoryMatchConfig
  | SequencePuzzleConfig
  | TimingChallengeConfig
  | PatternRecognitionConfig
  | MathMiniGameConfig
  | SortingGameConfig
  | ReactionTestConfig;

// Mini-game result tracking
export interface MiniGameResult {
  id: string;
  gameId: string;
  playerId: string;
  sessionId: string;
  score: number;
  timeSpent: number;
  attempts: number;
  success: boolean;
  details: Record<string, any>;
  timestamp: number;
}

// Default configurations for quick creation
export const DEFAULT_MINI_GAME_CONFIGS: Record<MiniGameType, Omit<BaseMiniGameConfig, 'id' | 'title' | 'description' | 'createdAt' | 'updatedAt'>> = {
  'click-targets': {
    type: 'click-targets',
    difficulty: 5,
    timeLimit: 30,
    maxAttempts: 3,
    scoringSystem: {
      basePoints: 10,
      timeMultiplier: true,
      difficultyBonus: true,
    },
    visualTheme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      backgroundColor: '#F8FAFC',
      textColor: '#1E293B',
      accentColor: '#F59E0B',
    },
    sounds: {},
    assets: [],
    successThreshold: 80,
    published: false,
  },
  'memory-match': {
    type: 'memory-match',
    difficulty: 4,
    timeLimit: 120,
    maxAttempts: 1,
    scoringSystem: {
      basePoints: 20,
      timeMultiplier: true,
      bonusConditions: ['perfect-match'],
    },
    visualTheme: {
      primaryColor: '#10B981',
      secondaryColor: '#047857',
      backgroundColor: '#ECFDF5',
      textColor: '#064E3B',
      accentColor: '#F59E0B',
    },
    sounds: {},
    assets: [],
    successThreshold: 100,
    published: false,
  },
  'sequence-puzzle': {
    type: 'sequence-puzzle',
    difficulty: 6,
    timeLimit: 60,
    maxAttempts: 2,
    scoringSystem: {
      basePoints: 15,
      timeMultiplier: true,
      difficultyBonus: true,
    },
    visualTheme: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#7C3AED',
      backgroundColor: '#FAF5FF',
      textColor: '#581C87',
      accentColor: '#F59E0B',
    },
    sounds: {},
    assets: [],
    successThreshold: 70,
    published: false,
  },
  'timing-challenge': {
    type: 'timing-challenge',
    difficulty: 7,
    timeLimit: 45,
    maxAttempts: 5,
    scoringSystem: {
      basePoints: 25,
      timeMultiplier: false,
      difficultyBonus: true,
      bonusConditions: ['perfect-timing'],
    },
    visualTheme: {
      primaryColor: '#EF4444',
      secondaryColor: '#DC2626',
      backgroundColor: '#FEF2F2',
      textColor: '#7F1D1D',
      accentColor: '#F59E0B',
    },
    sounds: {},
    assets: [],
    successThreshold: 60,
    published: false,
  },
  'pattern-recognition': {
    type: 'pattern-recognition',
    difficulty: 8,
    timeLimit: 90,
    maxAttempts: 3,
    scoringSystem: {
      basePoints: 30,
      timeMultiplier: true,
      difficultyBonus: true,
    },
    visualTheme: {
      primaryColor: '#06B6D4',
      secondaryColor: '#0891B2',
      backgroundColor: '#ECFEFF',
      textColor: '#164E63',
      accentColor: '#F59E0B',
    },
    sounds: {},
    assets: [],
    successThreshold: 75,
    published: false,
  },
  'math-mini-game': {
    type: 'math-mini-game',
    difficulty: 5,
    timeLimit: 60,
    maxAttempts: 1,
    scoringSystem: {
      basePoints: 12,
      timeMultiplier: true,
      difficultyBonus: true,
    },
    visualTheme: {
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      backgroundColor: '#FFFBEB',
      textColor: '#92400E',
      accentColor: '#3B82F6',
    },
    sounds: {},
    assets: [],
    successThreshold: 80,
    published: false,
  },
  'sorting-game': {
    type: 'sorting-game',
    difficulty: 4,
    timeLimit: 90,
    maxAttempts: 1,
    scoringSystem: {
      basePoints: 18,
      timeMultiplier: true,
      bonusConditions: ['perfect-sort'],
    },
    visualTheme: {
      primaryColor: '#84CC16',
      secondaryColor: '#65A30D',
      backgroundColor: '#F7FEE7',
      textColor: '#365314',
      accentColor: '#F59E0B',
    },
    sounds: {},
    assets: [],
    successThreshold: 90,
    published: false,
  },
  'reaction-test': {
    type: 'reaction-test',
    difficulty: 6,
    timeLimit: 30,
    maxAttempts: 3,
    scoringSystem: {
      basePoints: 20,
      timeMultiplier: false,
      difficultyBonus: true,
    },
    visualTheme: {
      primaryColor: '#EC4899',
      secondaryColor: '#DB2777',
      backgroundColor: '#FDF2F8',
      textColor: '#831843',
      accentColor: '#F59E0B',
    },
    sounds: {},
    assets: [],
    successThreshold: 70,
    published: false,
  },
};

// Helper function to generate ID
export function generateMiniGameId(): string {
  return `minigame-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}