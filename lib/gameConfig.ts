export type Difficulty = 'NORMAL' | 'HARD' | 'NIGHTMARE' | 'EXTREME';
export type GameRoom = 'CRYO_BAY' | 'MED_BAY' | 'ENGINEERING' | 'BRIDGE' | 'COMMAND_CENTER';
export type MonsterTier = 1 | 2 | 3 | 4 | 5;

export interface GameConfig {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  clueDifficulty: 'EASY' | 'MEDIUM' | 'HARD';
  oxygenTime: number; // in minutes
  maxPlayers: number;
  roomOrder: GameRoom[] | 'RANDOMIZED';
  maxMonsterTier: MonsterTier;
  tierSpawnWeights: {
    tier1: number;
    tier2: number;
    tier3: number;
    tier4: number;
    tier5: number;
  };
  bossSelection: 'AUTO' | 'CHARGER_WARLORD' | 'SPITTER_QUEEN' | 'ABOMINATION' | 'VOID_ENTITY';
  healthMultiplier: number;
  speedMultiplier: number;
  damageMultiplier: number;
  spawnRateMultiplier: number;
  createdAt: number;
}

export const DEFAULT_GAME_CONFIG: Omit<GameConfig, 'id' | 'name' | 'description' | 'createdAt'> = {
  difficulty: 'NORMAL',
  clueDifficulty: 'MEDIUM',
  oxygenTime: 15,
  maxPlayers: 4,
  roomOrder: ['CRYO_BAY', 'MED_BAY', 'ENGINEERING', 'BRIDGE', 'COMMAND_CENTER'],
  maxMonsterTier: 3,
  tierSpawnWeights: {
    tier1: 50,
    tier2: 30,
    tier3: 20,
    tier4: 0,
    tier5: 0
  },
  bossSelection: 'AUTO',
  healthMultiplier: 1.0,
  speedMultiplier: 1.0,
  damageMultiplier: 1.0,
  spawnRateMultiplier: 1.0,
};

export const DIFFICULTY_MULTIPLIERS = {
  NORMAL: {
    health: 1.0,
    speed: 1.0,
    damage: 1.0,
    spawnRate: 1.0,
    bossHP: 1.0
  },
  HARD: {
    health: 1.25,
    speed: 1.15,
    damage: 1.15,
    spawnRate: 1.2,
    bossHP: 1.25
  },
  NIGHTMARE: {
    health: 1.5,
    speed: 1.3,
    damage: 1.3,
    spawnRate: 1.5,
    bossHP: 1.5
  },
  EXTREME: {
    health: 2.0,
    speed: 1.5,
    damage: 1.5,
    spawnRate: 2.0,
    bossHP: 2.0
  }
};