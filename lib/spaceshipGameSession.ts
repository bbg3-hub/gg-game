import { GameConfig, DEFAULT_GAME_CONFIG, DIFFICULTY_MULTIPLIERS } from './gameConfig';
import { GameRoom, Difficulty } from './gameConfig';
import { getRoomConfig } from './roomConfig';
import { calculateMonsterStats, MonsterType } from './monsterConfig';

export type PlayerStatus = 'joined' | 'alive' | 'dead' | 'escaped';
export type GamePhase = 'setup' | 'room_clearing' | 'clue_decoding' | 'boss_fight' | 'victory' | 'defeat';

export interface Player {
  id: string;
  token: string;
  name: string;
  playerNumber: number;
  status: PlayerStatus;
  health: number;
  ammo: number;
  position: { x: number; y: number };
  room: GameRoom;
  currentRoom: GameRoom;
  kills: {
    tier1: number;
    tier2: number;
    tier3: number;
    tier4: number;
    tier5: number;
    total: number;
  };
  accuracy: number;
  totalShots: number;
  successfulShots: number;
  damageDealt: number;
  timeSpent: number; // milliseconds
  joinedAt: number;
  lastSyncAt: number;
}

export interface ActiveMonster {
  id: string;
  type: MonsterType;
  tier: 1 | 2 | 3 | 4 | 5;
  health: number;
  maxHealth: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  targetId?: string;
  attackCooldown: number;
  specialAbilities: string[];
  isBoss: boolean;
  bossPhase?: number;
  maxBossPhases?: number;
  lastAttack: number;
  effects: {
    stunned: boolean;
    slow: boolean;
    regenerating: boolean;
  };
}

export interface SpaceshipGameSession {
  id: string;
  gameCode: string;
  adminId: string;
  config: GameConfig;
  players: Player[];
  status: GamePhase;
  currentRoom: GameRoom;
  roomProgress: {
    completed: GameRoom[];
    currentRoomIndex: number;
  };
  monsters: ActiveMonster[];
  oxygenRemaining: number; // milliseconds
  startTime: number;
  lastUpdate: number;
  bossActive: boolean;
  clueSolved: boolean;
  victory: boolean;
  defeat: boolean;
  roomStartTime: number;
  totalKills: number;
  roomStats: {
    monstersKilled: { [tier: number]: number };
    damageDealt: number;
    shotsFired: number;
    shotsHit: number;
  };
}

const MAX_PLAYERS = 4;
const PLAYER_HEALTH = 100;
const PLAYER_AMMO = 30;

// In-memory storage for development
const sessions = new Map<string, SpaceshipGameSession>();
const gameCodeToId = new Map<string, string>();
const playerTokenToGameId = new Map<string, string>();

function generateGameCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  return code;
}

function generatePlayerToken(): string {
  return `spaceship-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateSessionId(): string {
  return `spaceship-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createSpaceshipGameSession(adminId: string, config: Partial<GameConfig> = {}): SpaceshipGameSession {
  const sessionId = generateSessionId();
  let gameCode = generateGameCode();
  
  // Ensure unique game code
  while (gameCodeToId.has(gameCode)) {
    gameCode = generateGameCode();
  }

  const gameConfig: GameConfig = {
    id: sessionId,
    name: config.name || 'Void Spire Expedition',
    description: config.description || '4-player cooperative space station survival',
    difficulty: config.difficulty || DEFAULT_GAME_CONFIG.difficulty,
    clueDifficulty: config.clueDifficulty || DEFAULT_GAME_CONFIG.clueDifficulty,
    oxygenTime: config.oxygenTime || DEFAULT_GAME_CONFIG.oxygenTime,
    maxPlayers: config.maxPlayers || DEFAULT_GAME_CONFIG.maxPlayers,
    roomOrder: config.roomOrder || DEFAULT_GAME_CONFIG.roomOrder,
    maxMonsterTier: config.maxMonsterTier || DEFAULT_GAME_CONFIG.maxMonsterTier,
    tierSpawnWeights: config.tierSpawnWeights || DEFAULT_GAME_CONFIG.tierSpawnWeights,
    bossSelection: config.bossSelection || DEFAULT_GAME_CONFIG.bossSelection,
    healthMultiplier: config.healthMultiplier || DEFAULT_GAME_CONFIG.healthMultiplier,
    speedMultiplier: config.speedMultiplier || DEFAULT_GAME_CONFIG.speedMultiplier,
    damageMultiplier: config.damageMultiplier || DEFAULT_GAME_CONFIG.damageMultiplier,
    spawnRateMultiplier: config.spawnRateMultiplier || DEFAULT_GAME_CONFIG.spawnRateMultiplier,
    createdAt: Date.now()
  };

  const session: SpaceshipGameSession = {
    id: sessionId,
    gameCode,
    adminId,
    config: gameConfig,
    players: [],
    status: 'setup',
    currentRoom: 'CRYO_BAY',
    roomProgress: {
      completed: [],
      currentRoomIndex: 0
    },
    monsters: [],
    oxygenRemaining: gameConfig.oxygenTime * 60 * 1000,
    startTime: Date.now(),
    lastUpdate: Date.now(),
    bossActive: false,
    clueSolved: false,
    victory: false,
    defeat: false,
    roomStartTime: Date.now(),
    totalKills: 0,
    roomStats: {
      monstersKilled: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      damageDealt: 0,
      shotsFired: 0,
      shotsHit: 0
    }
  };

  sessions.set(sessionId, session);
  gameCodeToId.set(gameCode, sessionId);

  return session;
}

export function getSpaceshipGameSession(sessionId: string): SpaceshipGameSession | null {
  return sessions.get(sessionId) || null;
}

export function getSpaceshipGameSessionByCode(gameCode: string): SpaceshipGameSession | null {
  const sessionId = gameCodeToId.get(gameCode);
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
}

export function joinSpaceshipGame(
  gameCode: string, 
  playerName: string
): { success: boolean; playerToken?: string; error?: string } {
  const session = getSpaceshipGameSessionByCode(gameCode);
  if (!session) {
    return { success: false, error: 'Invalid game code' };
  }

  if (session.players.length >= session.config.maxPlayers) {
    return { success: false, error: `Game is full (maximum ${session.config.maxPlayers} players)` };
  }

  if (session.status !== 'setup') {
    return { success: false, error: 'Game has already started' };
  }

  const playerNumber = session.players.length;
  const playerToken = generatePlayerToken();

  const player: Player = {
    id: `player-${playerNumber}`,
    token: playerToken,
    name: playerName,
    playerNumber,
    status: 'joined',
    health: PLAYER_HEALTH,
    ammo: PLAYER_AMMO,
    position: { x: 100 + playerNumber * 50, y: 400 }, // Stagger starting positions
    room: 'CRYO_BAY',
    currentRoom: 'CRYO_BAY',
    kills: {
      tier1: 0,
      tier2: 0,
      tier3: 0,
      tier4: 0,
      tier5: 0,
      total: 0
    },
    accuracy: 0,
    totalShots: 0,
    successfulShots: 0,
    damageDealt: 0,
    timeSpent: 0,
    joinedAt: Date.now(),
    lastSyncAt: Date.now()
  };

  session.players.push(player);
  playerTokenToGameId.set(playerToken, session.id);

  return { success: true, playerToken };
}

export function getPlayerByToken(playerToken: string): { player: Player | null; session: SpaceshipGameSession | null } {
  const sessionId = playerTokenToGameId.get(playerToken);
  if (!sessionId) {
    return { player: null, session: null };
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return { player: null, session: null };
  }

  const player = session.players.find((p) => p.token === playerToken);
  if (!player) {
    return { player: null, session: null };
  }

  return { player, session };
}

export function startSpaceshipGame(sessionId: string): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;

  if (session.players.length === 0) {
    return false;
  }

  // Initialize players
  session.players.forEach((player, index) => {
    player.status = 'alive';
    player.health = PLAYER_HEALTH;
    player.ammo = PLAYER_AMMO;
    player.position = { x: 100 + index * 50, y: 400 };
  });

  // Start with first room
  session.status = 'room_clearing';
  session.roomStartTime = Date.now();
  session.lastUpdate = Date.now();

  // Spawn initial monsters for the first room
  spawnRoomMonsters(session);

  return true;
}

export function spawnRoomMonsters(session: SpaceshipGameSession): void {
  const roomConfig = getRoomConfig(session.currentRoom, session.config.difficulty);
  const difficultyMultipliers = DIFFICULTY_MULTIPLIERS[session.config.difficulty];
  
  roomConfig.monsterSpawns.forEach((spawnConfig, index) => {
    // Check conditions
    if (spawnConfig.conditions) {
      if (spawnConfig.conditions.difficulty && !spawnConfig.conditions.difficulty.includes(session.config.difficulty)) {
        return;
      }
    }

    // Spawn monsters after delay
    setTimeout(() => {
      for (let i = 0; i < spawnConfig.count; i++) {
        const monster: ActiveMonster = {
          id: `${session.currentRoom}-${spawnConfig.type}-${Date.now()}-${i}`,
          type: spawnConfig.type as MonsterType,
          tier: spawnConfig.tier as 1 | 2 | 3 | 4 | 5,
          health: 100, // Will be calculated properly below
          maxHealth: 100,
          position: {
            x: Math.random() * 800 + 100, // Random position in room
            y: Math.random() * 600 + 100
          },
          velocity: { x: 0, y: 0 },
          attackCooldown: 0,
          specialAbilities: [],
          isBoss: false,
          lastAttack: 0,
          effects: {
            stunned: false,
            slow: false,
            regenerating: false
          }
        };

        // Calculate proper stats
        const stats = calculateMonsterStats(monster.type, monster.tier, {
          health: difficultyMultipliers.health * session.config.healthMultiplier,
          speed: difficultyMultipliers.speed * session.config.speedMultiplier,
          damage: difficultyMultipliers.damage * session.config.damageMultiplier
        });

        monster.health = stats.health;
        monster.maxHealth = stats.health;
        monster.attackCooldown = stats.attackCooldown;

        session.monsters.push(monster);
      }
    }, spawnConfig.spawnDelay * 1000 * session.config.spawnRateMultiplier);
  });
}

export function updatePlayerPosition(
  playerToken: string, 
  position: { x: number; y: number }
): boolean {
  const { player, session } = getPlayerByToken(playerToken);
  if (!player || !session) return false;

  player.position = position;
  player.lastSyncAt = Date.now();
  return true;
}

export function updatePlayerAmmo(
  playerToken: string,
  ammo: number
): boolean {
  const { player, session } = getPlayerByToken(playerToken);
  if (!player || !session) return false;

  player.ammo = Math.max(0, ammo);
  return true;
}

export function playerShoot(
  playerToken: string,
  targetX: number,
  targetY: number
): { hit: boolean; damage: number; targetId?: string } {
  const { player, session } = getPlayerByToken(playerToken);
  if (!player || !session || player.ammo <= 0) {
    return { hit: false, damage: 0 };
  }

  // Decrease ammo
  player.ammo--;
  player.totalShots++;

  // Check if shot hit any monster
  let hit = false;
  let damage = 0;
  let targetId: string | undefined;

  for (const monster of session.monsters) {
    const distance = Math.sqrt(
      Math.pow(monster.position.x - targetX, 2) + 
      Math.pow(monster.position.y - targetY, 2)
    );

    // Hit if within 30 pixels of target
    if (distance <= 30) {
      hit = true;
      targetId = monster.id;
      damage = 25; // Base damage
      monster.health -= damage;
      player.successfulShots++;
      player.damageDealt += damage;
      session.roomStats.shotsFired++;
      session.roomStats.shotsHit++;

      // Calculate accuracy
      player.accuracy = player.totalShots > 0 ? (player.successfulShots / player.totalShots) * 100 : 0;

      // Check if monster is dead
      if (monster.health <= 0) {
        // Remove monster and update kill count
        const monsterIndex = session.monsters.findIndex(m => m.id === monster.id);
        if (monsterIndex !== -1) {
          session.monsters.splice(monsterIndex, 1);
          session.totalKills++;
          session.roomStats.monstersKilled[monster.tier]++;
          player.kills.tier1 = (player.kills.tier1 || 0) + (monster.tier === 1 ? 1 : 0);
          player.kills.tier2 = (player.kills.tier2 || 0) + (monster.tier === 2 ? 1 : 0);
          player.kills.tier3 = (player.kills.tier3 || 0) + (monster.tier === 3 ? 1 : 0);
          player.kills.tier4 = (player.kills.tier4 || 0) + (monster.tier === 4 ? 1 : 0);
          player.kills.tier5 = (player.kills.tier5 || 0) + (monster.tier === 5 ? 1 : 0);
          player.kills.total++;
        }
      }
      break;
    }
  }

  if (!hit) {
    session.roomStats.shotsFired++;
  }

  return { hit, damage, targetId };
}

export function submitClueAnswer(
  sessionId: string,
  playerToken: string,
  answer: string
): { correct: boolean; attempts: number; maxAttempts: number } {
  const session = sessions.get(sessionId);
  if (!session) return { correct: false, attempts: 0, maxAttempts: 0 };

  const roomConfig = getRoomConfig(session.currentRoom, session.config.difficulty);
  const clue = roomConfig.clue;

  // Simple validation - in a real game, you'd have more sophisticated checking
  const correct = answer.toUpperCase().trim() === clue.decoded.toUpperCase().trim();
  
  // Update room progress
  if (correct && !session.clueSolved) {
    session.clueSolved = true;
    session.oxygenRemaining += roomConfig.oxygenReward * 1000; // Add oxygen bonus
  }

  return {
    correct,
    attempts: 1, // Simplified for now
    maxAttempts: clue.attempts
  };
}

export function getRemainingTime(session: SpaceshipGameSession): number {
  const elapsed = Date.now() - session.startTime;
  const remaining = session.oxygenRemaining - elapsed;
  return Math.max(0, remaining);
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function updateGameState(sessionId: string): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;

  const now = Date.now();
  const deltaTime = now - session.lastUpdate;
  session.lastUpdate = now;

  // Update oxygen
  session.oxygenRemaining -= deltaTime;

  // Check game over conditions
  if (session.oxygenRemaining <= 0) {
    session.status = 'defeat';
    session.defeat = true;
    return true;
  }

  // Update room progress
  if (session.status === 'room_clearing') {
    // Check if all monsters are cleared
    if (session.monsters.length === 0 && !session.bossActive) {
      session.status = 'clue_decoding';
    }
  }

  // Check if clue is solved and proceed to next room
  if (session.status === 'clue_decoding' && session.clueSolved) {
    // Mark current room as completed
    session.roomProgress.completed.push(session.currentRoom);
    session.roomProgress.currentRoomIndex++;

    // Check if game is complete
    const allRooms: GameRoom[] = ['CRYO_BAY', 'MED_BAY', 'ENGINEERING', 'BRIDGE', 'COMMAND_CENTER'];
    if (session.roomProgress.currentRoomIndex >= allRooms.length) {
      session.status = 'victory';
      session.victory = true;
      return true;
    }

    // Move to next room
    session.currentRoom = allRooms[session.roomProgress.currentRoomIndex];
    session.status = 'room_clearing';
    session.clueSolved = false;
    session.roomStartTime = now;
    session.roomStats = {
      monstersKilled: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      damageDealt: 0,
      shotsFired: 0,
      shotsHit: 0
    };

    // Spawn monsters for new room
    spawnRoomMonsters(session);
  }

  // Update player stats
  session.players.forEach(player => {
    if (player.status === 'alive') {
      player.timeSpent += deltaTime;
    }
  });

  return true;
}

export function getAllSpaceshipAdminSessions(adminId: string): SpaceshipGameSession[] {
  return Array.from(sessions.values()).filter((s) => s.adminId === adminId);
}

export function deleteSpaceshipSession(sessionId: string): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;

  // Clean up player token mappings
  session.players.forEach((player) => {
    playerTokenToGameId.delete(player.token);
  });

  gameCodeToId.delete(session.gameCode);
  sessions.delete(sessionId);
  return true;
}