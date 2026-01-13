export interface Player {
  id: string;
  name: string;
  color: string;
  morseCompleted: boolean;
  meaningCompleted: boolean;
  miniGameCompleted: boolean;
  bonusCompleted: boolean;
  morseScore: number;
  meaningScore: number;
  miniGameScore: number;
  bonusScore: number;
  totalScore: number;
}

export interface GameState {
  players: Player[];
  startTime: number;
  oxygenMinutes: number;
  currentPhase: 'setup' | 'playing' | 'escape' | 'final' | 'victory' | 'gameover';
  escapeSlotsUnlocked: number;
  finalSequence: number[];
}

const STORAGE_KEY = 'space-station-game';

export function initializeGame(playerNames: string[]): GameState {
  const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'];
  const players: Player[] = playerNames.map((name, index) => ({
    id: `player-${index + 1}`,
    name,
    color: colors[index],
    morseCompleted: false,
    meaningCompleted: false,
    miniGameCompleted: false,
    bonusCompleted: false,
    morseScore: 0,
    meaningScore: 0,
    miniGameScore: 0,
    bonusScore: 0,
    totalScore: 0,
  }));

  const gameState: GameState = {
    players,
    startTime: Date.now(),
    oxygenMinutes: 120,
    currentPhase: 'playing',
    escapeSlotsUnlocked: 0,
    finalSequence: [],
  };

  saveGameState(gameState);
  return gameState;
}

export function saveGameState(gameState: GameState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }
}

export function loadGameState(): GameState | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  }
  return null;
}

export function clearGameState(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function updatePlayerProgress(
  gameState: GameState,
  playerId: string,
  puzzle: 'morse' | 'meaning' | 'miniGame' | 'bonus',
  score: number
): GameState {
  const updatedPlayers = gameState.players.map((player) => {
    if (player.id === playerId) {
      const updated = { ...player };
      
      if (puzzle === 'morse') {
        updated.morseCompleted = true;
        updated.morseScore = score;
      } else if (puzzle === 'meaning') {
        updated.meaningCompleted = true;
        updated.meaningScore = score;
      } else if (puzzle === 'miniGame') {
        updated.miniGameCompleted = true;
        updated.miniGameScore = score;
      } else if (puzzle === 'bonus') {
        updated.bonusCompleted = true;
        updated.bonusScore = score;
      }
      
      updated.totalScore = 
        updated.morseScore + 
        updated.meaningScore + 
        updated.miniGameScore + 
        updated.bonusScore;
      
      return updated;
    }
    return player;
  });

  const updatedState = { ...gameState, players: updatedPlayers };
  
  const allPlayersComplete = updatedPlayers.every(
    (p) => p.morseCompleted && p.meaningCompleted && p.miniGameCompleted && p.bonusCompleted
  );
  
  if (allPlayersComplete && gameState.escapeSlotsUnlocked === 0) {
    updatedState.escapeSlotsUnlocked = 4;
  }
  
  saveGameState(updatedState);
  return updatedState;
}

export function getRemainingTime(startTime: number, oxygenMinutes: number): number {
  const elapsed = Date.now() - startTime;
  const remaining = oxygenMinutes * 60 * 1000 - elapsed;
  return Math.max(0, remaining);
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function checkGameOver(gameState: GameState): boolean {
  const remaining = getRemainingTime(gameState.startTime, gameState.oxygenMinutes);
  return remaining <= 0;
}

export const GREEK_WORDS = [
  {
    word: 'LOGOS',
    meaning: 'word, reason, principle',
    options: ['word, reason, principle', 'soul, spirit, breath', 'sky, heaven, upper air', 'time, season, opportunity'],
  },
  {
    word: 'PSYCHE',
    meaning: 'soul, spirit, breath',
    options: ['word, reason, principle', 'soul, spirit, breath', 'sky, heaven, upper air', 'time, season, opportunity'],
  },
  {
    word: 'AETHER',
    meaning: 'sky, heaven, upper air',
    options: ['word, reason, principle', 'soul, spirit, breath', 'sky, heaven, upper air', 'time, season, opportunity'],
  },
  {
    word: 'KAIROS',
    meaning: 'time, season, opportunity',
    options: ['word, reason, principle', 'soul, spirit, breath', 'sky, heaven, upper air', 'time, season, opportunity'],
  },
];

export const MORSE_CODE: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', ' ': '/'
};

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map((char) => MORSE_CODE[char] || '')
    .join(' ');
}

export function morseToText(morse: string): string {
  const reverseMorse: { [key: string]: string } = {};
  Object.entries(MORSE_CODE).forEach(([key, value]) => {
    reverseMorse[value] = key;
  });
  
  return morse
    .split(' ')
    .map((code) => reverseMorse[code] || '')
    .join('');
}

export function playMorseAudio(morse: string, onComplete?: () => void): void {
  if (typeof window === 'undefined') return;
  
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioContext = new AudioContextClass();
  const dotDuration = 100;
  const dashDuration = dotDuration * 3;
  const gapDuration = dotDuration;
  const letterGap = dotDuration * 3;
  const wordGap = dotDuration * 7;
  
  let currentTime = audioContext.currentTime;
  
  morse.split('').forEach((symbol) => {
    if (symbol === '.') {
      playTone(audioContext, currentTime, dotDuration);
      currentTime += (dotDuration + gapDuration) / 1000;
    } else if (symbol === '-') {
      playTone(audioContext, currentTime, dashDuration);
      currentTime += (dashDuration + gapDuration) / 1000;
    } else if (symbol === ' ') {
      currentTime += letterGap / 1000;
    } else if (symbol === '/') {
      currentTime += wordGap / 1000;
    }
  });
  
  if (onComplete) {
    setTimeout(onComplete, currentTime * 1000);
  }
}

function playTone(audioContext: AudioContext, startTime: number, duration: number): void {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 600;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, startTime);
  gainNode.gain.setValueAtTime(0.3, startTime + duration / 1000);
  gainNode.gain.setValueAtTime(0, startTime + duration / 1000 + 0.01);
  
  oscillator.start(startTime);
  oscillator.stop(startTime + duration / 1000 + 0.01);
}
