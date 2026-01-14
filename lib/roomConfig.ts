import { GameRoom, Difficulty } from './gameConfig';

export interface Clue {
  id: string;
  type: 'MORSE' | 'CAESAR' | 'BINARY' | 'SUBSTITUTION' | 'PATTERN';
  encoded: string;
  decoded: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  attempts: number;
}

export interface MonsterSpawn {
  type: string;
  tier: number;
  count: number;
  spawnDelay: number; // seconds
  optional?: boolean;
  conditions?: {
    difficulty?: Difficulty[];
    requirePreviousRoom?: boolean;
  };
}

export interface RoomConfig {
  id: GameRoom;
  name: string;
  description: string;
  narrative: string[];
  background: string;
  monsterSpawns: MonsterSpawn[];
  clue: Clue;
  bossEncounter?: {
    normal: string;
    hard: string;
    nightmare: string;
    extreme: string;
  };
  oxygenReward: number; // seconds added for completion
  visualTheme: {
    primary: string;
    secondary: string;
    ambient: string;
    particleColor: string;
  };
}

export const CLUE_TEMPLATES = {
  MORSE: {
    easy: [
      { encoded: '... --- ...', decoded: 'SOS' },
      { encoded: '.... ..', decoded: 'HI' },
      { encoded: '..---', decoded: 'DE' }
    ],
    medium: [
      { encoded: '.... . .-.. .-.. ---', decoded: 'HELLO' },
      { encoded: '.... --- ...--', decoded: 'HOS' }
    ],
    hard: [
      { encoded: '.... . .-.. .-.. --- --..--', decoded: 'HELLO,' },
      { encoded: '.... --- --... ..... -----', decoded: 'HOPE7' }
    ]
  },
  CAESAR: {
    easy: [
      { encoded: 'URYJ', decoded: 'HELP' },
      { encoded: 'KHOOR', decoded: 'HELLO' }
    ],
    medium: [
      { encoded: 'SHYY IRUZDUG', decoded: 'HELP FORWARD' },
      { encoded: 'WKH GRRU LV EURRN LQ WKH VFSDOHG VWBSLRQ', decoded: 'THE GAME IS BORING IN THE SCALED VERSION' }
    ],
    hard: [
      { encoded: 'ZKLV LV MXVW D WHVW', decoded: 'THIS IS JUST A TEST' },
      { encoded: 'WKH VWBSLRQ LV UHFRPPHQGHG', decoded: 'THE GAME IS RECOMMENDED' }
    ]
  },
  BINARY: {
    easy: [
      { encoded: '01001000 01000101 01001100 01010000', decoded: 'HELP' },
      { encoded: '01001000 01000101 01001100 01001100 01001111', decoded: 'HELLO' }
    ],
    medium: [
      { encoded: '01001000 01000101 01001100 01010000 01000110 01001111 01010010 01010111 01000001 01010010 01000100', decoded: 'HELP FORWARD' },
      { encoded: '01001001 01001110 01010100 01001111', decoded: 'INTO' }
    ],
    hard: [
      { encoded: '01001000 01000101 01001100 01010000 01000110 01001111 01010010 01010111 01000001 01010010 01000100', decoded: 'HELP FORWARD' },
      { encoded: '01000011 01001111 01001101 01001101 01000001 01001110 01000100', decoded: 'COMMAND' }
    ]
  },
  SUBSTITUTION: {
    easy: [
      { encoded: '8-5-12-16', decoded: 'HELP' },
      { encoded: '13-1-18-19', decoded: 'MARS' }
    ],
    medium: [
      { encoded: '7-5-12-13-1', decoded: 'GELMA' },
      { encoded: '1-18-20-5-13-9-19', decoded: 'ARTEMIS' }
    ],
    hard: [
      { encoded: '15-2-12-9-22-9-15-21-19', decoded: 'OBLIVIOUS' },
      { encoded: '3-18-25-15-19-20-1-12', decoded: 'CRYOSTAL' }
    ]
  },
  PATTERN: {
    easy: [
      { encoded: '★☆★☆★', decoded: 'POWER' },
      { encoded: '●●○●●', decoded: 'ALPHA' }
    ],
    medium: [
      { encoded: '▲△▲△▲', decoded: 'BRIDGE' },
      { encoded: '■□■□■', decoded: 'ENGINE' }
    ],
    hard: [
      { encoded: '★★★☆☆', decoded: 'SPACE' },
      { encoded: '⚡⚡⚡⚡', decoded: 'VOID' }
    ]
  }
};

export const ROOM_CONFIGS: Record<GameRoom, RoomConfig> = {
  CRYO_BAY: {
    id: 'CRYO_BAY',
    name: 'Cryo Bay',
    description: 'Wake up in wreckage, alarms blaring',
    narrative: [
      'The cryo pod hisses open...',
      'Emergency lights flicker in the darkness.',
      'Alarms blare throughout the station.',
      'You are the sole survivor of the Void Spire crash.',
      'Find the escape beacon before oxygen runs out!'
    ],
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    monsterSpawns: [
      { type: 'CRAWLER', tier: 1, count: 5, spawnDelay: 0 },
      { type: 'CRAWLER', tier: 2, count: 0, spawnDelay: 0, optional: true, conditions: { difficulty: ['HARD', 'NIGHTMARE', 'EXTREME'] } }
    ],
    clue: {
      id: 'cryo-1',
      type: 'MORSE',
      encoded: CLUE_TEMPLATES.MORSE.easy[0].encoded,
      decoded: CLUE_TEMPLATES.MORSE.easy[0].decoded,
      difficulty: 'EASY',
      attempts: 3
    },
    oxygenReward: 120, // 2 minutes
    visualTheme: {
      primary: '#00ffff',
      secondary: '#0088cc',
      ambient: '#0a1a2a',
      particleColor: '#ffffff'
    }
  },
  MED_BAY: {
    id: 'MED_BAY',
    name: 'Med Bay',
    description: 'Bio-hazard containment failed',
    narrative: [
      'The medical bay reeks of antiseptic and decay.',
      'Containment pods are shattered, their contents... missing.',
      'You hear strange sounds from the vents above.',
      'These creatures are drawn to the sound of your breathing.',
      'Move quickly and quietly through the contaminated zone.'
    ],
    background: 'linear-gradient(180deg, #2d1b3d 0%, #1a1a2e 50%, #0f3460 100%)',
    monsterSpawns: [
      { type: 'CRAWLER', tier: 1, count: 4, spawnDelay: 5 },
      { type: 'CHARGER', tier: 2, count: 2, spawnDelay: 15 },
      { type: 'SPITTER', tier: 2, count: 1, spawnDelay: 25 }
    ],
    clue: {
      id: 'med-1',
      type: 'CAESAR',
      encoded: CLUE_TEMPLATES.CAESAR.medium[0].encoded,
      decoded: CLUE_TEMPLATES.CAESAR.medium[0].decoded,
      difficulty: 'MEDIUM',
      attempts: 3
    },
    oxygenReward: 180, // 3 minutes
    visualTheme: {
      primary: '#ff0040',
      secondary: '#cc0033',
      ambient: '#330011',
      particleColor: '#ff3366'
    }
  },
  ENGINEERING: {
    id: 'ENGINEERING',
    name: 'Engineering',
    description: 'Power systems failing, machinery hazards',
    narrative: [
      'Sparks fly from damaged conduits.',
      'The emergency power flickers ominously.',
      'Mechanical drones have gone rogue.',
      'Their red sensors track your movement.',
      'The path to the bridge lies through the core chamber.'
    ],
    background: 'linear-gradient(180deg, #3d1a1b 0%, #2d1b3d 50%, #1a1a2e 100%)',
    monsterSpawns: [
      { type: 'CRAWLER', tier: 1, count: 2, spawnDelay: 0 },
      { type: 'CHARGER', tier: 2, count: 3, spawnDelay: 10 },
      { type: 'SPITTER', tier: 2, count: 2, spawnDelay: 20 },
      { type: 'CRAWLER', tier: 3, count: 1, spawnDelay: 30 }
    ],
    clue: {
      id: 'eng-1',
      type: 'BINARY',
      encoded: CLUE_TEMPLATES.BINARY.medium[0].encoded,
      decoded: CLUE_TEMPLATES.BINARY.medium[0].decoded,
      difficulty: 'MEDIUM',
      attempts: 3
    },
    bossEncounter: {
      normal: 'NONE',
      hard: 'NONE',
      nightmare: 'OOZE_BLOB_T3',
      extreme: 'OOZE_BLOB_T3'
    },
    oxygenReward: 240, // 4 minutes
    visualTheme: {
      primary: '#ffff00',
      secondary: '#ff8800',
      ambient: '#332200',
      particleColor: '#ffcc00'
    }
  },
  BRIDGE: {
    id: 'BRIDGE',
    name: 'Bridge',
    description: 'Command functions, where beacon is',
    narrative: [
      'The command bridge looms ahead.',
      'The emergency beacon is visible through the reinforced glass.',
      'Armored sentinels guard the control panels.',
      'Their shields reflect your weapon fire harmlessly.',
      'The beacon activation code is encrypted in the central computer.'
    ],
    background: 'linear-gradient(180deg, #1a3d1a 0%, #2d1b3d 50%, #3d1a1b 100%)',
    monsterSpawns: [
      { type: 'CRAWLER', tier: 1, count: 1, spawnDelay: 0 },
      { type: 'CHARGER', tier: 2, count: 3, spawnDelay: 8 },
      { type: 'SPITTER', tier: 3, count: 2, spawnDelay: 16 },
      { type: 'ARMORED_KNIGHT', tier: 3, count: 1, spawnDelay: 24 }
    ],
    clue: {
      id: 'bridge-1',
      type: 'SUBSTITUTION',
      encoded: CLUE_TEMPLATES.SUBSTITUTION.medium[0].encoded,
      decoded: CLUE_TEMPLATES.SUBSTITUTION.medium[0].decoded,
      difficulty: 'MEDIUM',
      attempts: 3
    },
    oxygenReward: 300, // 5 minutes
    visualTheme: {
      primary: '#00ff00',
      secondary: '#88ff00',
      ambient: '#113311',
      particleColor: '#88ff88'
    }
  },
  COMMAND_CENTER: {
    id: 'COMMAND_CENTER',
    name: 'Command Center',
    description: 'Final boss fight, beacon activation, escape',
    narrative: [
      'The final chamber where it all ends.',
      'The beacon awaits activation.',
      'But something else has awakened here.',
      'A creature beyond comprehension.',
      'Defeat it and activate the beacon to escape!'
    ],
    background: 'linear-gradient(180deg, #0d0d0d 0%, #2d1b3d 25%, #3d1a1b 50%, #1a1a2e 75%, #0f3460 100%)',
    monsterSpawns: [
      { type: 'CRAWLER', tier: 3, count: 2, spawnDelay: 0, optional: true },
      { type: 'SPITTER', tier: 3, count: 1, spawnDelay: 5, optional: true }
    ],
    clue: {
      id: 'command-1',
      type: 'PATTERN',
      encoded: CLUE_TEMPLATES.PATTERN.hard[0].encoded,
      decoded: CLUE_TEMPLATES.PATTERN.hard[0].decoded,
      difficulty: 'HARD',
      attempts: 5
    },
    bossEncounter: {
      normal: 'CHARGER_WARLORD',
      hard: 'SPITTER_HIVE_QUEEN',
      nightmare: 'ELDER_ABOMINATION_IRON_GUARDIAN',
      extreme: 'VOID_ENTITY'
    },
    oxygenReward: 600, // 10 minutes (bonus for survival)
    visualTheme: {
      primary: '#ff6600',
      secondary: '#ff0066',
      ambient: '#110011',
      particleColor: '#ffffff'
    }
  }
};

export function getRoomConfig(room: GameRoom, difficulty: Difficulty): RoomConfig {
  const config = ROOM_CONFIGS[room];
  const adjustedConfig = { ...config };
  
  // Adjust for difficulty
  switch (difficulty) {
    case 'HARD':
      // Increase spawn rates, add more monsters
      adjustedConfig.monsterSpawns = config.monsterSpawns.map(spawn => ({
        ...spawn,
        count: Math.ceil(spawn.count * 1.2),
        spawnDelay: Math.max(1, spawn.spawnDelay * 0.8)
      }));
      break;
    case 'NIGHTMARE':
      // Heavy T3-4, spawn every 12-18 sec
      adjustedConfig.monsterSpawns = config.monsterSpawns.map(spawn => ({
        ...spawn,
        count: Math.ceil(spawn.count * 1.5),
        spawnDelay: Math.max(1, spawn.spawnDelay * 0.6)
      }));
      break;
    case 'EXTREME':
      // Mostly T4, spawn every 10-15 sec
      adjustedConfig.monsterSpawns = config.monsterSpawns.map(spawn => ({
        ...spawn,
        count: Math.ceil(spawn.count * 2),
        spawnDelay: Math.max(1, spawn.spawnDelay * 0.5)
      }));
      break;
  }
  
  return adjustedConfig;
}

export function getRandomClue(difficulty: 'EASY' | 'MEDIUM' | 'HARD', type?: string): Clue {
  const types = type ? [type] : ['MORSE', 'CAESAR', 'BINARY', 'SUBSTITUTION', 'PATTERN'];
  const selectedType = types[Math.floor(Math.random() * types.length)];
  const templates = CLUE_TEMPLATES[selectedType as keyof typeof CLUE_TEMPLATES];
  const difficultyTemplates = templates[difficulty.toLowerCase() as keyof typeof templates];
  const template = difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)];
  
  return {
    id: `${selectedType.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type: selectedType as Clue['type'],
    encoded: template.encoded,
    decoded: template.decoded,
    difficulty,
    attempts: difficulty === 'HARD' ? 5 : 3
  };
}