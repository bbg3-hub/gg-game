import 'server-only';

import fs from 'fs';
import path from 'path';
import {
  DEFAULT_MAX_MEANING_ATTEMPTS,
  DEFAULT_MAX_MORSE_ATTEMPTS,
  DEFAULT_OXYGEN_MINUTES,
  GameSession,
  Player,
  getEffectiveGreekWords,
  getEffectiveMaxMeaningAttempts,
  getEffectiveMaxMorseAttempts,
  getEffectiveMorseWords,
} from '@/lib/gameSession';

const MAX_PLAYERS = 4;

const sessions = new Map<string, GameSession>();
const gameCodeToId = new Map<string, string>();
const playerTokenToGameId = new Map<string, string>();

const DATA_DIR = path.join(process.cwd(), 'data');
const PERSISTENCE_FILE = path.join(DATA_DIR, 'sessions.json');

type PersistedDataV1 = {
  version: 1;
  sessions: GameSession[];
};

let loaded = false;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function rebuildIndexes() {
  gameCodeToId.clear();
  playerTokenToGameId.clear();

  for (const session of sessions.values()) {
    gameCodeToId.set(session.gameCode, session.id);
    for (const player of session.players) {
      playerTokenToGameId.set(player.token, session.id);
    }
  }
}

function loadFromDiskOnce() {
  if (loaded) return;
  loaded = true;

  try {
    ensureDataDir();
    if (!fs.existsSync(PERSISTENCE_FILE)) return;

    const raw = fs.readFileSync(PERSISTENCE_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as PersistedDataV1;

    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.sessions)) return;

    sessions.clear();
    for (const session of parsed.sessions) {
      const normalized: GameSession = {
        ...session,
        createdAt: typeof session.createdAt === 'number' ? session.createdAt : Date.now(),
        oxygenMinutes: typeof session.oxygenMinutes === 'number' ? session.oxygenMinutes : DEFAULT_OXYGEN_MINUTES,
        players: Array.isArray(session.players) ? session.players : [],
        startTime: typeof session.startTime === 'number' ? session.startTime : null,
        status: session.status || 'waiting',
        finalEscapeCode: session.finalEscapeCode || '',
      };

      sessions.set(normalized.id, normalized);
    }

    rebuildIndexes();
  } catch (error) {
    console.error('Failed to load sessions from disk:', error);
  }
}

function saveToDisk() {
  try {
    ensureDataDir();
    const data: PersistedDataV1 = { version: 1, sessions: Array.from(sessions.values()) };
    const tmpPath = `${PERSISTENCE_FILE}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpPath, PERSISTENCE_FILE);
  } catch (error) {
    console.error('Failed to save sessions to disk:', error);
  }
}

function generateGameCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  return code;
}

function generatePlayerToken(): string {
  return `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createGameSession(adminId: string): GameSession {
  loadFromDiskOnce();

  const sessionId = generateSessionId();
  let gameCode = generateGameCode();

  while (gameCodeToId.has(gameCode)) {
    gameCode = generateGameCode();
  }

  const session: GameSession = {
    id: sessionId,
    gameCode,
    adminId,
    players: [],
    startTime: null,
    oxygenMinutes: DEFAULT_OXYGEN_MINUTES,
    status: 'waiting',
    finalEscapeCode: '',
    createdAt: Date.now(),
  };

  sessions.set(sessionId, session);
  gameCodeToId.set(gameCode, sessionId);
  saveToDisk();

  return session;
}

export function getGameSession(sessionId: string): GameSession | null {
  loadFromDiskOnce();
  return sessions.get(sessionId) || null;
}

export function getGameSessionByCode(gameCode: string): GameSession | null {
  loadFromDiskOnce();
  const sessionId = gameCodeToId.get(gameCode);
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
}

export function joinGame(gameCode: string, playerName: string): { success: boolean; playerToken?: string; error?: string } {
  loadFromDiskOnce();

  const session = getGameSessionByCode(gameCode);
  if (!session) return { success: false, error: 'Invalid game code' };

  if (session.status === 'completed') {
    return { success: false, error: 'This game has already ended' };
  }

  if (session.players.length >= MAX_PLAYERS) {
    return { success: false, error: 'Game is full (maximum 4 players)' };
  }

  const playerId = session.players.length;
  const morseWords = getEffectiveMorseWords(session);
  const greekWords = getEffectiveGreekWords(session);

  const morseWord = morseWords[playerId % morseWords.length];
  const greekWordIndex = playerId % greekWords.length;

  const player: Player = {
    token: generatePlayerToken(),
    name: playerName,
    playerId,
    status: 'joined',
    morseAttempts: 0,
    morseCompleted: false,
    meaningAttempts: 0,
    meaningCompleted: false,
    miniGameScore: 0,
    miniGameCompleted: false,
    bonusQ1Correct: false,
    bonusQ2Correct: false,
    bonusCompleted: false,
    totalScore: 0,
    morseWord,
    greekWordIndex,
  };

  session.players.push(player);
  playerTokenToGameId.set(player.token, session.id);

  if (session.startTime === null) {
    session.startTime = Date.now();
    session.status = 'active';
  }

  saveToDisk();
  return { success: true, playerToken: player.token };
}

export function getPlayerByToken(playerToken: string): { player: Player | null; session: GameSession | null } {
  loadFromDiskOnce();

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

export function updatePlayerProgress(playerToken: string, updates: Partial<Player>): boolean {
  loadFromDiskOnce();

  const { player, session } = getPlayerByToken(playerToken);
  if (!player || !session) return false;

  const playerIndex = session.players.findIndex((p) => p.token === playerToken);
  if (playerIndex === -1) return false;

  session.players[playerIndex] = { ...player, ...updates };

  const updatedPlayer = session.players[playerIndex];
  const morseScore = updatedPlayer.morseCompleted ? Math.max(0, 250 - (updatedPlayer.morseAttempts - 1) * 50) : 0;
  const meaningScore = updatedPlayer.meaningCompleted ? Math.max(0, 250 - (updatedPlayer.meaningAttempts - 1) * 50) : 0;
  const miniGameScore = updatedPlayer.miniGameCompleted ? updatedPlayer.miniGameScore : 0;
  const bonusScore = updatedPlayer.bonusCompleted ? 200 : 0;
  updatedPlayer.totalScore = morseScore + meaningScore + miniGameScore + bonusScore;

  const allComplete = session.players.every((p) => p.morseCompleted && p.meaningCompleted && p.miniGameCompleted && p.bonusCompleted);

  if (allComplete && session.finalEscapeCode === '') {
    const digits = [];
    for (let i = 0; i < 4; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }
    session.finalEscapeCode = digits.join('');
  }

  saveToDisk();
  return true;
}

export function submitMorseAnswer(playerToken: string, answer: string): { correct: boolean; attempts: number; maxAttempts: number } {
  loadFromDiskOnce();

  const { player, session } = getPlayerByToken(playerToken);
  const maxAttempts = session ? getEffectiveMaxMorseAttempts(session) : DEFAULT_MAX_MORSE_ATTEMPTS;

  if (!player || !session) return { correct: false, attempts: 0, maxAttempts };

  if (player.morseCompleted) {
    return { correct: true, attempts: player.morseAttempts, maxAttempts };
  }

  if (player.morseAttempts >= maxAttempts) {
    return { correct: false, attempts: player.morseAttempts, maxAttempts };
  }

  const attempts = player.morseAttempts + 1;
  const correct = answer.toUpperCase() === player.morseWord;

  updatePlayerProgress(playerToken, {
    morseAttempts: attempts,
    morseCompleted: correct,
  });

  return { correct, attempts, maxAttempts };
}

export function submitMeaningAnswer(playerToken: string, answer: string): { correct: boolean; attempts: number; maxAttempts: number } {
  loadFromDiskOnce();

  const { player, session } = getPlayerByToken(playerToken);
  const maxAttempts = session ? getEffectiveMaxMeaningAttempts(session) : DEFAULT_MAX_MEANING_ATTEMPTS;

  if (!player || !session) return { correct: false, attempts: 0, maxAttempts };

  if (!player.morseCompleted) {
    return { correct: false, attempts: 0, maxAttempts };
  }

  if (player.meaningCompleted) {
    return { correct: true, attempts: player.meaningAttempts, maxAttempts };
  }

  if (player.meaningAttempts >= maxAttempts) {
    return { correct: false, attempts: player.meaningAttempts, maxAttempts };
  }

  const greekWords = getEffectiveGreekWords(session);
  const greekWordIndex = player.greekWordIndex % greekWords.length;
  const attempts = player.meaningAttempts + 1;
  const correct = answer === greekWords[greekWordIndex].meaning;

  updatePlayerProgress(playerToken, {
    meaningAttempts: attempts,
    meaningCompleted: correct,
  });

  return { correct, attempts, maxAttempts };
}

export function submitMiniGameScore(playerToken: string, score: number): boolean {
  loadFromDiskOnce();

  const { player } = getPlayerByToken(playerToken);
  if (!player || !player.meaningCompleted) return false;

  return updatePlayerProgress(playerToken, {
    miniGameScore: score,
    miniGameCompleted: true,
  });
}

export function submitBonusAnswers(playerToken: string, q1Correct: boolean, q2Correct: boolean): boolean {
  loadFromDiskOnce();

  const { player } = getPlayerByToken(playerToken);
  if (!player || !player.miniGameCompleted) return false;

  return updatePlayerProgress(playerToken, {
    bonusQ1Correct: q1Correct,
    bonusQ2Correct: q2Correct,
    bonusCompleted: true,
    status: 'completed',
  });
}

export function getAllAdminSessions(adminId: string): GameSession[] {
  loadFromDiskOnce();
  return Array.from(sessions.values())
    .filter((s) => s.adminId === adminId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function deleteSession(sessionId: string): boolean {
  loadFromDiskOnce();

  const session = sessions.get(sessionId);
  if (!session) return false;

  for (const player of session.players) {
    playerTokenToGameId.delete(player.token);
  }

  gameCodeToId.delete(session.gameCode);
  sessions.delete(sessionId);
  saveToDisk();
  return true;
}

type PuzzleUpdate = {
  customMorseWords?: string[];
  customGreekWords?: GameSession['customGreekWords'];
  customMaxMorseAttempts?: number;
  customMaxMeaningAttempts?: number;
  customOxygenMinutes?: number;
};

export function updateSessionPuzzleSettings(adminId: string, sessionId: string, update: PuzzleUpdate): GameSession | null {
  loadFromDiskOnce();

  const session = sessions.get(sessionId);
  if (!session) return null;
  if (session.adminId !== adminId) return null;

  if (Object.prototype.hasOwnProperty.call(update, 'customMorseWords')) {
    session.customMorseWords = update.customMorseWords;
  }

  if (Object.prototype.hasOwnProperty.call(update, 'customGreekWords')) {
    session.customGreekWords = update.customGreekWords;
  }

  if (Object.prototype.hasOwnProperty.call(update, 'customMaxMorseAttempts')) {
    session.customMaxMorseAttempts = update.customMaxMorseAttempts;
  }

  if (Object.prototype.hasOwnProperty.call(update, 'customMaxMeaningAttempts')) {
    session.customMaxMeaningAttempts = update.customMaxMeaningAttempts;
  }

  if (Object.prototype.hasOwnProperty.call(update, 'customOxygenMinutes')) {
    session.customOxygenMinutes = update.customOxygenMinutes;
  }

  saveToDisk();
  return session;
}

export function exportAdminSessions(adminId: string): GameSession[] {
  loadFromDiskOnce();
  return getAllAdminSessions(adminId);
}

type BuilderUpdate = {
  phases?: GameSession['phases'];
  title?: string;
  description?: string;
  settings?: GameSession['settings'];
};

export function updateSessionWithBuilder(sessionId: string, adminId: string, update: BuilderUpdate): GameSession | null {
  loadFromDiskOnce();

  const session = sessions.get(sessionId);
  if (!session) return null;
  if (session.adminId !== adminId) return null;

  if (Object.prototype.hasOwnProperty.call(update, 'phases')) {
    session.phases = update.phases;
  }

  if (Object.prototype.hasOwnProperty.call(update, 'title')) {
    session.title = update.title;
  }

  if (Object.prototype.hasOwnProperty.call(update, 'description')) {
    session.description = update.description;
  }

  if (Object.prototype.hasOwnProperty.call(update, 'settings')) {
    session.settings = update.settings;
  }

  saveToDisk();
  return session;
}
