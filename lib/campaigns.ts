import type { MiniGameConfig } from './mini-games';
import type { EducationalPuzzle } from './educationalPuzzles';

export interface GameFlowStep {
  id: string;
  type: 'puzzle' | 'mini-game' | 'educational' | 'branch' | 'story' | 'rest';
  title: string;
  description?: string;
  duration?: number; // minutes
  difficulty?: number; // 1-10
  unlockConditions?: {
    previousSteps?: string[];
    minScore?: number;
    minTime?: number;
    customLogic?: string;
  };
  settings?: Record<string, unknown>;
}

export interface GameFlow {
  id: string;
  name: string;
  description: string;
  steps: GameFlowStep[];
  totalDuration?: number; // minutes
  difficulty: number; // 1-10
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CampaignLevel {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  gameFlowId: string;
  difficulty: number; // 1-10
  estimatedDuration: number; // minutes
  prerequisites?: string[]; // other level IDs
  rewards?: {
    points?: number;
    badges?: string[];
    unlocks?: string[];
  };
  isActive: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  theme: 'horror' | 'educational' | 'mixed' | 'sci-fi' | 'fantasy' | 'casual';
  levels: CampaignLevel[];
  totalDuration: number; // minutes
  difficulty: number; // 1-10
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  preview?: string; // image URL
}

// Game progression rules
export interface ProgressionRule {
  id: string;
  name: string;
  condition: {
    type: 'score' | 'time' | 'attempts' | 'custom';
    operator: 'gte' | 'lte' | 'eq' | 'gt' | 'lt';
    value: number;
  };
  action: {
    type: 'unlock' | 'skip' | 'branch' | 'repeat' | 'end';
    target?: string; // step ID, level ID, etc.
    parameters?: Record<string, unknown>;
  };
}

export interface GameSessionConfig {
  id: string;
  name: string;
  type: 'campaign' | 'custom' | 'tournament' | 'training';
  campaignId?: string;
  gameFlowId?: string;
  customSteps?: GameFlowStep[];
  maxPlayers: number;
  duration: number; // minutes
  difficulty: number; // 1-10
  settings: {
    enableHints: boolean;
    enableSkip: boolean;
    enableReview: boolean;
    timeLimitPerStep?: number;
    maxAttempts: number;
    autoSave: boolean;
    backupFrequency: number; // minutes
  };
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

// Branching logic for dynamic game paths
export interface BranchCondition {
  id: string;
  stepId: string; // which step this branch comes from
  condition: {
    type: 'score' | 'time' | 'attempts' | 'puzzle_solved' | 'mini_game_score' | 'custom';
    operator: 'gte' | 'lte' | 'eq' | 'gt' | 'lt' | 'contains';
    value: unknown;
  };
  nextStepId: string;
  label: string; // descriptive label for the branch
}

export interface DifficultyScaling {
  enabled: boolean;
  type: 'adaptive' | 'fixed' | 'progressive';
  parameters: {
    minDifficulty: number;
    maxDifficulty: number;
    adjustmentRate: number; // how quickly difficulty adjusts
    successThreshold: number; // percentage for difficulty increase
    failureThreshold: number; // percentage for difficulty decrease
  };
}

// Educational mode settings
export interface EducationalMode {
  enabled: boolean;
  subjects: string[]; // math, physics, chemistry, etc.
  gradeLevel?: 'elementary' | 'middle' | 'high' | 'college';
  learningObjectives: string[];
  assessmentEnabled: boolean;
  progressTracking: boolean;
  skillAreas: {
    [skillName: string]: {
      weight: number; // importance in overall assessment
      puzzles: string[]; // puzzle IDs that test this skill
    };
  };
}

// Default templates for quick campaign creation
export const CAMPAIGN_TEMPLATES = {
  'horror-escape': {
    name: 'Horror Escape',
    description: 'Classic horror-themed escape room experience',
    theme: 'horror' as const,
    difficulty: 6,
    levels: [
      {
        id: 'level-1',
        name: 'The Beginning',
        description: 'Find the key and escape the locked room',
        objectives: ['Find hidden key', 'Solve door puzzle', 'Escape room'],
        gameFlowId: 'horror-flow-1',
        difficulty: 4,
        estimatedDuration: 15,
        isActive: true,
      },
      {
        id: 'level-2',
        name: 'The Laboratory',
        description: 'Navigate through the cursed laboratory',
        objectives: ['Deactivate security system', 'Find antidote', 'Avoid traps'],
        gameFlowId: 'horror-flow-2',
        difficulty: 6,
        estimatedDuration: 25,
        prerequisites: ['level-1'],
        isActive: true,
      },
      {
        id: 'level-3',
        name: 'The Final Challenge',
        description: 'Face the ultimate horror to escape',
        objectives: ['Solve final puzzle', 'Defeat the entity', 'Escape facility'],
        gameFlowId: 'horror-flow-3',
        difficulty: 8,
        estimatedDuration: 30,
        prerequisites: ['level-2'],
        isActive: true,
      },
    ],
    tags: ['horror', 'escape', 'classic'],
  },
  'math-adventure': {
    name: 'Math Adventure',
    description: 'Educational mathematics puzzle adventure',
    theme: 'educational' as const,
    difficulty: 4,
    levels: [
      {
        id: 'math-level-1',
        name: 'Number Foundations',
        description: 'Basic arithmetic and number theory',
        objectives: ['Master basic operations', 'Understand patterns', 'Build confidence'],
        gameFlowId: 'math-flow-1',
        difficulty: 3,
        estimatedDuration: 20,
        isActive: true,
      },
      {
        id: 'math-level-2',
        name: 'Geometry Explorer',
        description: 'Spatial reasoning and geometric puzzles',
        objectives: ['Understand shapes', 'Calculate areas', 'Solve spatial puzzles'],
        gameFlowId: 'math-flow-2',
        difficulty: 5,
        estimatedDuration: 25,
        prerequisites: ['math-level-1'],
        isActive: true,
      },
      {
        id: 'math-level-3',
        name: 'Advanced Problem Solving',
        description: 'Complex mathematical challenges',
        objectives: ['Apply multiple concepts', 'Think critically', 'Master advanced topics'],
        gameFlowId: 'math-flow-3',
        difficulty: 7,
        estimatedDuration: 30,
        prerequisites: ['math-level-2'],
        isActive: true,
      },
    ],
    tags: ['math', 'education', 'problem-solving'],
  },
  'mixed-challenge': {
    name: 'Mixed Challenge',
    description: 'Combines horror elements with educational content',
    theme: 'mixed' as const,
    difficulty: 5,
    levels: [
      {
        id: 'mixed-level-1',
        name: 'The Academic Escape',
        description: 'Use knowledge to escape supernatural threats',
        objectives: ['Apply academic knowledge', 'Solve under pressure', 'Combine skills'],
        gameFlowId: 'mixed-flow-1',
        difficulty: 5,
        estimatedDuration: 22,
        isActive: true,
      },
    ],
    tags: ['mixed', 'educational', 'horror'],
  },
};

// Sample game flows for different scenarios
export const SAMPLE_GAME_FLOWS = {
  'horror-basic': {
    name: 'Basic Horror Flow',
    description: 'Standard horror puzzle sequence',
    difficulty: 5,
    isActive: true,
    steps: [
      {
        id: 'intro',
        type: 'story',
        title: 'Welcome to the Nightmare',
        description: 'You wake up in a dark room...',
        duration: 2,
      },
      {
        id: 'puzzle-1',
        type: 'puzzle',
        title: 'The Locked Door',
        description: 'Find the combination to escape',
        duration: 8,
        difficulty: 4,
        unlockConditions: {},
        settings: {
          puzzleType: 'combination',
          attempts: 3,
        },
      },
      {
        id: 'mini-game-1',
        type: 'mini-game',
        title: 'Memory Challenge',
        description: 'Remember the pattern to proceed',
        duration: 5,
        difficulty: 5,
        unlockConditions: {
          previousSteps: ['puzzle-1'],
        },
        settings: {
          miniGameType: 'memory-match',
        },
      },
      {
        id: 'educational-1',
        type: 'educational',
        title: 'Knowledge Check',
        description: 'Solve this puzzle using what you know',
        duration: 10,
        difficulty: 4,
        unlockConditions: {
          previousSteps: ['mini-game-1'],
        },
        settings: {
          category: 'math',
          difficulty: 'medium',
        },
      },
    ],
  },
  'educational-basic': {
    name: 'Educational Flow',
    description: 'Pure educational experience',
    difficulty: 3,
    isActive: true,
    steps: [
      {
        id: 'intro',
        type: 'story',
        title: 'Learning Journey Begins',
        description: 'Welcome to your educational adventure',
        duration: 2,
      },
      {
        id: 'educational-1',
        type: 'educational',
        title: 'Math Basics',
        description: 'Start with fundamental math concepts',
        duration: 15,
        difficulty: 2,
        settings: {
          category: 'math',
          difficulty: 'easy',
        },
      },
      {
        id: 'mini-game-1',
        type: 'mini-game',
        title: 'Quick Calculations',
        description: 'Practice arithmetic with this mini-game',
        duration: 8,
        difficulty: 3,
        unlockConditions: {
          previousSteps: ['educational-1'],
        },
        settings: {
          miniGameType: 'math-mini-game',
        },
      },
      {
        id: 'educational-2',
        type: 'educational',
        title: 'Applied Mathematics',
        description: 'Use math in real-world scenarios',
        duration: 12,
        difficulty: 4,
        unlockConditions: {
          previousSteps: ['mini-game-1'],
        },
        settings: {
          category: 'finance',
          difficulty: 'medium',
        },
      },
    ],
  },
};

// Helper functions
export function createCampaignFromTemplate(
  template: keyof typeof CAMPAIGN_TEMPLATES,
  customizations?: Partial<Campaign>
): Campaign {
  const baseTemplate = CAMPAIGN_TEMPLATES[template];
  const now = Date.now();
  
  return {
    id: generateId(),
    name: customizations?.name || baseTemplate.name,
    description: customizations?.description || baseTemplate.description,
    theme: baseTemplate.theme,
    levels: baseTemplate.levels.map((level, index) => ({
      ...level,
      id: customizations?.levels?.[index]?.id || level.id,
    })),
    totalDuration: baseTemplate.levels.reduce((total, level) => total + level.estimatedDuration, 0),
    difficulty: customizations?.difficulty || baseTemplate.difficulty,
    isActive: customizations?.isActive ?? true,
    createdAt: now,
    updatedAt: now,
    tags: customizations?.tags || baseTemplate.tags,
    preview: customizations?.preview,
  };
}

export function createGameFlowFromSteps(steps: Omit<GameFlowStep, 'id'>[]): GameFlow {
  const now = Date.now();
  
  return {
    id: generateId(),
    name: `Custom Flow ${now}`,
    description: 'Custom game flow created from steps',
    steps: steps.map(step => ({
      ...step,
      id: generateId(),
    })),
    difficulty: Math.round(steps.reduce((total, step) => total + (step.difficulty || 5), 0) / steps.length),
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function calculateCampaignProgress(campaign: Campaign, completedLevels: string[]): number {
  const totalLevels = campaign.levels.length;
  const completedCount = campaign.levels.filter(level => completedLevels.includes(level.id)).length;
  return Math.round((completedCount / totalLevels) * 100);
}

export function getNextLevel(campaign: Campaign, currentLevelId?: string): CampaignLevel | null {
  if (!currentLevelId) {
    return campaign.levels.find(level => !level.prerequisites?.length) || null;
  }
  
  const currentLevel = campaign.levels.find(level => level.id === currentLevelId);
  if (!currentLevel) return null;
  
  // Find next level that has current level as prerequisite
  return campaign.levels.find(level => 
    level.prerequisites?.includes(currentLevelId)
  ) || null;
}