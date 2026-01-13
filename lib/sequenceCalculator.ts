import { Player } from './gameLogic';

export function calculateFinalSequence(players: Player[]): number[] {
  const scores = players.map((p) => p.totalScore);
  const sum = scores.reduce((a, b) => a + b, 0);
  
  const digit1 = Math.floor(sum / 100) % 10;
  const digit2 = Math.floor(sum / 10) % 10;
  const digit3 = sum % 10;
  
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const diff = maxScore - minScore;
  const digit4 = diff % 10;
  
  const avgScore = Math.floor(sum / players.length);
  const digit5 = avgScore % 10;
  
  const morseScores = players.map((p) => p.morseScore);
  const morseSum = morseScores.reduce((a, b) => a + b, 0);
  const digit6 = morseSum % 10;
  
  return [digit1, digit2, digit3, digit4, digit5, digit6];
}

export function formatSequence(sequence: number[]): string {
  return sequence.join('-');
}

export function validateSequence(input: string, correct: number[]): boolean {
  const cleaned = input.replace(/[^0-9]/g, '');
  const inputSequence = cleaned.split('').map(Number);
  
  if (inputSequence.length !== correct.length) return false;
  
  return inputSequence.every((digit, index) => digit === correct[index]);
}
