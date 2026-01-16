export interface GreekWord {
  word: string;
  meaning: string;
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: 'text' | 'multiple-choice' | 'open-response';
  title: string;
  content: string;
  solution: string;
  options?: QuestionOption[];
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeLimit?: number;
  maxAttempts?: number;
  hints?: string[];
}

export interface GamePhase {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  order: number;
}

export interface PlayerQuestionProgress {
  questionId: string;
  attempts: number;
  completed: boolean;
  correct: boolean;
  score: number;
}

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
  questionProgress?: PlayerQuestionProgress[];
  currentPhaseIndex?: number;
  currentQuestionIndex?: number;
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
  createdAt: number;
  customMorseWords?: string[];
  customGreekWords?: GreekWord[];
  customMaxMorseAttempts?: number;
  customMaxMeaningAttempts?: number;
  customOxygenMinutes?: number;
  phases?: GamePhase[];
  title?: string;
  description?: string;
  settings?: {
    oxygenMinutes: number;
    maxPlayers: number;
  };
}

export const DEFAULT_GREEK_WORDS: GreekWord[] = [
  { word: 'LOGOS', meaning: 'word, reason, principle' },
  { word: 'PSYCHE', meaning: 'soul, spirit, breath' },
  { word: 'AETHER', meaning: 'sky, heaven, upper air' },
  { word: 'KAIROS', meaning: 'time, season, opportunity' },
];

export const DEFAULT_MORSE_WORDS = ['SOS', 'HELP', 'ESCAPE', 'OXYGEN', 'ALERT', 'DANGER', 'RESCUE', 'URGENT'];

export const DEFAULT_MAX_MORSE_ATTEMPTS = 5;
export const DEFAULT_MAX_MEANING_ATTEMPTS = 5;
export const DEFAULT_OXYGEN_MINUTES = 120;

export function getEffectiveMorseWords(session: Pick<GameSession, 'customMorseWords'>): string[] {
  if (session.customMorseWords && session.customMorseWords.length > 0) return session.customMorseWords;
  return DEFAULT_MORSE_WORDS;
}

export function getEffectiveGreekWords(session: Pick<GameSession, 'customGreekWords'>): GreekWord[] {
  if (session.customGreekWords && session.customGreekWords.length > 0) return session.customGreekWords;
  return DEFAULT_GREEK_WORDS;
}

export function getEffectiveMaxMorseAttempts(session: Pick<GameSession, 'customMaxMorseAttempts'>): number {
  const value = session.customMaxMorseAttempts;
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
  return DEFAULT_MAX_MORSE_ATTEMPTS;
}

export function getEffectiveMaxMeaningAttempts(session: Pick<GameSession, 'customMaxMeaningAttempts'>): number {
  const value = session.customMaxMeaningAttempts;
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
  return DEFAULT_MAX_MEANING_ATTEMPTS;
}

export function getEffectiveOxygenMinutes(session: Pick<GameSession, 'oxygenMinutes' | 'customOxygenMinutes'>): number {
  const value = session.customOxygenMinutes;
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
  return session.oxygenMinutes;
}

export function getRemainingTime(session: Pick<GameSession, 'startTime' | 'oxygenMinutes' | 'customOxygenMinutes'>): number {
  const oxygenMinutes = getEffectiveOxygenMinutes(session);
  if (!session.startTime) return oxygenMinutes * 60 * 1000;
  const elapsed = Date.now() - session.startTime;
  const remaining = oxygenMinutes * 60 * 1000 - elapsed;
  return Math.max(0, remaining);
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function isGameOver(session: Pick<GameSession, 'startTime' | 'oxygenMinutes' | 'customOxygenMinutes' | 'status'>): boolean {
  return getRemainingTime(session) <= 0 || session.status === 'completed';
}

export function getGreekWord(index: number, greekWords: GreekWord[] = DEFAULT_GREEK_WORDS) {
  return greekWords[index % greekWords.length];
}

export function hasCustomPuzzles(session: GameSession): boolean {
  return Boolean(
    (session.customMorseWords && session.customMorseWords.length > 0) ||
      (session.customGreekWords && session.customGreekWords.length > 0) ||
      typeof session.customMaxMorseAttempts === 'number' ||
      typeof session.customMaxMeaningAttempts === 'number' ||
      typeof session.customOxygenMinutes === 'number'
  );
}
