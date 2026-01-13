export interface Player {
  token: string;
  name: string;
  playerId: number;
  status: 'joined' | 'solving' | 'completed';
  morseAttempts: number;
  morseCompleted: boolean;
  meaningAttempts: number;
  meaningCompleted: boolean;
  miniGameScore: number;
  miniGameCompleted: boolean;
  bonusQ1Correct: boolean;
  bonusQ2Correct: boolean;
  bonusCompleted: boolean;
  totalScore: number;
  morseWord: string;
  greekWordIndex: number;
}

export interface GameSession {
  id: string;
  gameCode: string;
  adminId: string;
  players: Player[];
  startTime: number | null;
  oxygenMinutes: number;
  status: 'waiting' | 'active' | 'completed';
  finalEscapeCode: string;
}

const GREEK_WORDS = [
  { word: 'LOGOS', meaning: 'word, reason, principle' },
  { word: 'PSYCHE', meaning: 'soul, spirit, breath' },
  { word: 'AETHER', meaning: 'sky, heaven, upper air' },
  { word: 'KAIROS', meaning: 'time, season, opportunity' },
];

const MORSE_WORDS = ['SOS', 'HELP', 'ESCAPE', 'OXYGEN', 'ALERT', 'DANGER', 'RESCUE', 'URGENT'];

const MAX_PLAYERS = 4;
const MAX_MORSE_ATTEMPTS = 5;
const MAX_MEANING_ATTEMPTS = 5;

// In-memory storage (in production, use a database)
const sessions = new Map<string, GameSession>();
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
  return `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createGameSession(adminId: string): GameSession {
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  let gameCode = generateGameCode();
  
  // Ensure unique game code
  while (gameCodeToId.has(gameCode)) {
    gameCode = generateGameCode();
  }

  const session: GameSession = {
    id: sessionId,
    gameCode,
    adminId,
    players: [],
    startTime: null,
    oxygenMinutes: 120,
    status: 'waiting',
    finalEscapeCode: '',
  };

  sessions.set(sessionId, session);
  gameCodeToId.set(gameCode, sessionId);

  return session;
}

export function getGameSession(sessionId: string): GameSession | null {
  return sessions.get(sessionId) || null;
}

export function getGameSessionByCode(gameCode: string): GameSession | null {
  const sessionId = gameCodeToId.get(gameCode);
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
}

export function joinGame(gameCode: string, playerName: string): { success: boolean; playerToken?: string; error?: string } {
  const session = getGameSessionByCode(gameCode);
  if (!session) {
    return { success: false, error: 'Invalid game code' };
  }

  if (session.status === 'completed') {
    return { success: false, error: 'This game has already ended' };
  }

  if (session.players.length >= MAX_PLAYERS) {
    return { success: false, error: 'Game is full (maximum 4 players)' };
  }

  const playerId = session.players.length;
  const morseWord = MORSE_WORDS[playerId % MORSE_WORDS.length];
  const greekWordIndex = playerId % GREEK_WORDS.length;

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

  // Start the game when first player joins
  if (session.startTime === null) {
    session.startTime = Date.now();
    session.status = 'active';
  }

  return { success: true, playerToken: player.token };
}

export function getPlayerByToken(playerToken: string): { player: Player | null; session: GameSession | null } {
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
  const { player, session } = getPlayerByToken(playerToken);
  if (!player || !session) return false;

  const playerIndex = session.players.findIndex((p) => p.token === playerToken);
  if (playerIndex === -1) return false;

  session.players[playerIndex] = { ...player, ...updates };

  // Recalculate total score
  const updatedPlayer = session.players[playerIndex];
  const morseScore = updatedPlayer.morseCompleted ? Math.max(0, 250 - (updatedPlayer.morseAttempts - 1) * 50) : 0;
  const meaningScore = updatedPlayer.meaningCompleted ? Math.max(0, 250 - (updatedPlayer.meaningAttempts - 1) * 50) : 0;
  const miniGameScore = updatedPlayer.miniGameCompleted ? updatedPlayer.miniGameScore : 0;
  const bonusScore = updatedPlayer.bonusCompleted ? 200 : 0;
  updatedPlayer.totalScore = morseScore + meaningScore + miniGameScore + bonusScore;

  // Check if all players are complete
  const allComplete = session.players.every((p) => 
    p.morseCompleted && p.meaningCompleted && p.miniGameCompleted && p.bonusCompleted
  );

  if (allComplete && session.finalEscapeCode === '') {
    // Generate final escape code
    const digits = [];
    for (let i = 0; i < 4; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }
    session.finalEscapeCode = digits.join('');
  }

  return true;
}

export function submitMorseAnswer(playerToken: string, answer: string): { correct: boolean; attempts: number; maxAttempts: number } {
  const { player, session } = getPlayerByToken(playerToken);
  if (!player || !session) return { correct: false, attempts: 0, maxAttempts: MAX_MORSE_ATTEMPTS };

  if (player.morseCompleted) {
    return { correct: true, attempts: player.morseAttempts, maxAttempts: MAX_MORSE_ATTEMPTS };
  }

  if (player.morseAttempts >= MAX_MORSE_ATTEMPTS) {
    return { correct: false, attempts: player.morseAttempts, maxAttempts: MAX_MORSE_ATTEMPTS };
  }

  const attempts = player.morseAttempts + 1;
  const correct = answer.toUpperCase() === player.morseWord;

  updatePlayerProgress(playerToken, {
    morseAttempts: attempts,
    morseCompleted: correct,
  });

  return { correct, attempts, maxAttempts: MAX_MORSE_ATTEMPTS };
}

export function submitMeaningAnswer(playerToken: string, answer: string): { correct: boolean; attempts: number; maxAttempts: number } {
  const { player, session } = getPlayerByToken(playerToken);
  if (!player || !session) return { correct: false, attempts: 0, maxAttempts: MAX_MEANING_ATTEMPTS };

  if (!player.morseCompleted) {
    return { correct: false, attempts: 0, maxAttempts: MAX_MEANING_ATTEMPTS };
  }

  if (player.meaningCompleted) {
    return { correct: true, attempts: player.meaningAttempts, maxAttempts: MAX_MEANING_ATTEMPTS };
  }

  if (player.meaningAttempts >= MAX_MEANING_ATTEMPTS) {
    return { correct: false, attempts: player.meaningAttempts, maxAttempts: MAX_MEANING_ATTEMPTS };
  }

  const attempts = player.meaningAttempts + 1;
  const correct = answer === GREEK_WORDS[player.greekWordIndex].meaning;

  updatePlayerProgress(playerToken, {
    meaningAttempts: attempts,
    meaningCompleted: correct,
  });

  return { correct, attempts, maxAttempts: MAX_MEANING_ATTEMPTS };
}

export function submitMiniGameScore(playerToken: string, score: number): boolean {
  const { player } = getPlayerByToken(playerToken);
  if (!player || !player.meaningCompleted) return false;

  return updatePlayerProgress(playerToken, {
    miniGameScore: score,
    miniGameCompleted: true,
  });
}

export function submitBonusAnswers(playerToken: string, q1Correct: boolean, q2Correct: boolean): boolean {
  const { player } = getPlayerByToken(playerToken);
  if (!player || !player.miniGameCompleted) return false;

  return updatePlayerProgress(playerToken, {
    bonusQ1Correct: q1Correct,
    bonusQ2Correct: q2Correct,
    bonusCompleted: true,
    status: 'completed',
  });
}

export function getRemainingTime(session: GameSession): number {
  if (!session.startTime) return session.oxygenMinutes * 60 * 1000;
  const elapsed = Date.now() - session.startTime;
  const remaining = session.oxygenMinutes * 60 * 1000 - elapsed;
  return Math.max(0, remaining);
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function isGameOver(session: GameSession): boolean {
  return getRemainingTime(session) <= 0 || session.status === 'completed';
}

export function getGreekWord(index: number) {
  return GREEK_WORDS[index % GREEK_WORDS.length];
}

export function getAllAdminSessions(adminId: string): GameSession[] {
  return Array.from(sessions.values()).filter((s) => s.adminId === adminId);
}

export function deleteSession(sessionId: string): boolean {
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
