export type MonsterType = 'CRAWLER' | 'CHARGER' | 'SPITTER' | 'OOZE_BLOB' | 'ARMORED_KNIGHT' | 'MUTANT_ABOMINATION' | 'VOID_ENTITY';

export interface MonsterStats {
  health: number;
  damage: number;
  speed: number;
  size: number;
  attackCooldown: number;
  detectionRange: number;
  attackRange: number;
  movementPattern: 'CHARGE' | 'FLOAT' | 'CRAWL' | 'SLIME' | 'WALK' | 'ABOMINATION' | 'TELEPORT';
  specialAbilities: string[];
  visualEffects: {
    color: string;
    glow: string;
    outline: string;
    particles: string[];
  };
}

export interface TierMultipliers {
  health: number;
  damage: number;
  speed: number;
  size: number;
  special: string;
}

export const TIER_MULTIPLIERS: Record<1 | 2 | 3 | 4 | 5, TierMultipliers> = {
  1: { health: 1.0, damage: 1.0, speed: 1.0, size: 1.0, special: 'base' },
  2: { health: 1.5, damage: 1.2, speed: 0.9, size: 1.5, special: 'yellow_glow' },
  3: { health: 2.2, damage: 1.5, speed: 0.8, size: 2.0, special: 'orange_glow' },
  4: { health: 3.2, damage: 1.8, speed: 0.7, size: 2.8, special: 'red_glow' },
  5: { health: 5.0, damage: 2.0, speed: 0.6, size: 4.0, special: 'rainbow_cinematic' }
};

export const BASE_MONSTER_STATS: Record<MonsterType, MonsterStats> = {
  CRAWLER: {
    health: 50,
    damage: 10,
    speed: 30,
    size: 1.0,
    attackCooldown: 2000,
    detectionRange: 150,
    attackRange: 30,
    movementPattern: 'CRAWL',
    specialAbilities: ['basic_attack'],
    visualEffects: {
      color: '#666666',
      glow: '#888888',
      outline: '#999999',
      particles: ['dust']
    }
  },
  CHARGER: {
    health: 60,
    damage: 15,
    speed: 80,
    size: 1.2,
    attackCooldown: 3000,
    detectionRange: 200,
    attackRange: 40,
    movementPattern: 'CHARGE',
    specialAbilities: ['charge_attack', 'shockwave'],
    visualEffects: {
      color: '#8B4513',
      glow: '#CD853F',
      outline: '#DEB887',
      particles: ['sand', 'charge_spark']
    }
  },
  SPITTER: {
    health: 35,
    damage: 8,
    speed: 40,
    size: 0.8,
    attackCooldown: 1500,
    detectionRange: 180,
    attackRange: 120,
    movementPattern: 'FLOAT',
    specialAbilities: ['projectile_attack', 'multi_shot'],
    visualEffects: {
      color: '#4B0082',
      glow: '#8A2BE2',
      outline: '#9370DB',
      particles: ['mucus', 'acid_splash']
    }
  },
  OOZE_BLOB: {
    health: 100,
    damage: 12,
    speed: 20,
    size: 1.5,
    attackCooldown: 2500,
    detectionRange: 120,
    attackRange: 25,
    movementPattern: 'SLIME',
    specialAbilities: ['engulf', 'split', 'corrosive_touch'],
    visualEffects: {
      color: '#228B22',
      glow: '#32CD32',
      outline: '#90EE90',
      particles: ['slime', 'acid']
    }
  },
  ARMORED_KNIGHT: {
    health: 150,
    damage: 20,
    speed: 25,
    size: 1.8,
    attackCooldown: 2800,
    detectionRange: 160,
    attackRange: 35,
    movementPattern: 'WALK',
    specialAbilities: ['shield_block', 'bash', 'reinforcements'],
    visualEffects: {
      color: '#2F4F4F',
      glow: '#708090',
      outline: '#A9A9A9',
      particles: ['metal_spark', 'armor_clank']
    }
  },
  MUTANT_ABOMINATION: {
    health: 300,
    damage: 25,
    speed: 35,
    size: 2.5,
    attackCooldown: 2000,
    detectionRange: 180,
    attackRange: 50,
    movementPattern: 'ABOMINATION',
    specialAbilities: ['regenerate', 'multi_attack', 'limb_reattach'],
    visualEffects: {
      color: '#8B0000',
      glow: '#DC143C',
      outline: '#FF69B4',
      particles: ['flesh', 'energy', 'chaos']
    }
  },
  VOID_ENTITY: {
    health: 600,
    damage: 35,
    speed: 45,
    size: 3.5,
    attackCooldown: 1800,
    detectionRange: 250,
    attackRange: 200,
    movementPattern: 'TELEPORT',
    specialAbilities: ['phase_shift', 'reality_warp', 'shadow_clones', 'rift_zones', 'multi_phase'],
    visualEffects: {
      color: '#000000',
      glow: '#4B0082',
      outline: '#FFFFFF',
      particles: ['void', 'cosmic', 'reality_fragment']
    }
  }
};

export function calculateMonsterStats(
  type: MonsterType, 
  tier: 1 | 2 | 3 | 4 | 5,
  difficultyMultipliers: { health: number; speed: number; damage: number }
): MonsterStats {
  const base = BASE_MONSTER_STATS[type];
  const tierMult = TIER_MULTIPLIERS[tier];
  
  return {
    ...base,
    health: Math.floor(base.health * tierMult.health * difficultyMultipliers.health),
    damage: Math.floor(base.damage * tierMult.damage * difficultyMultipliers.damage),
    speed: Math.floor(base.speed * tierMult.speed * difficultyMultipliers.speed),
    size: base.size * tierMult.size,
  };
}

export const BOSS_CONFIGURATIONS = {
  CHARGER_WARLORD: {
    type: 'CHARGER' as MonsterType,
    tier: 5 as const,
    phases: 3,
    phaseTransitions: [0.66, 0.33], // Health thresholds for phase changes
    specialMoves: ['dual_charge', 'rampage', 'shockwave_aoe'],
    health: 300,
    description: 'A massive charger with three combat phases'
  },
  SPITTER_HIVE_QUEEN: {
    type: 'SPITTER' as MonsterType,
    tier: 5 as const,
    phases: 2,
    phaseTransitions: [0.5],
    specialMoves: ['drone_spawn', 'swarm_attack', 'poison_cloud', 'teleport'],
    health: 175,
    description: 'A hive mind spitter that spawns minions'
  },
  ELDER_ABOMINATION: {
    type: 'MUTANT_ABOMINATION' as MonsterType,
    tier: 5 as const,
    phases: 4,
    phaseTransitions: [0.75, 0.5, 0.25],
    specialMoves: ['accelerated_regen', 'limb_regrowth', 'chaos_attack'],
    health: 500,
    description: 'A multi-part abomination that regenerates and adapts'
  },
  IRON_GUARDIAN: {
    type: 'ARMORED_KNIGHT' as MonsterType,
    tier: 5 as const,
    phases: 3,
    phaseTransitions: [0.66, 0.33],
    specialMoves: ['shield_defense', 'aggressive_assault', 'desperate_frenzy'],
    health: 350,
    description: 'An ancient guardian with multiple defense modes'
  },
  VOID_ENTITY: {
    type: 'VOID_ENTITY' as MonsterType,
    tier: 5 as const,
    phases: 5,
    phaseTransitions: [0.8, 0.6, 0.4, 0.2],
    specialMoves: ['reality_bend', 'cosmic_horror', 'dimension_rift'],
    health: 600,
    description: 'A cosmic horror that manipulates reality itself'
  }
};