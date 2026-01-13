'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadGameState, updatePlayerProgress, GREEK_WORDS } from '@/lib/gameLogic';

export default function MeaningPage() {
  const router = useRouter();
  const playerId = 'player-2';
  const playerIndex = parseInt(playerId.split('-')[1]) - 1;
  const [puzzle] = useState(() => GREEK_WORDS[playerIndex]);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const gameState = loadGameState();
    if (!gameState) {
      router.push('/game/setup');
      return;
    }

    const player = gameState.players.find((p) => p.id === playerId);
    if (player?.meaningCompleted) {
      router.push('/game');
      return;
    }
  }, [router]);

  const handleAnswer = (selectedMeaning: string) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (selectedMeaning === puzzle.meaning) {
      const score = newAttempts === 1 ? 100 : 50;
      const gameState = loadGameState();
      if (gameState) {
        updatePlayerProgress(gameState, playerId, 'meaning', score);
      }
      setMessage(`✓ CORRECT! [+${score} pts]`);
      setTimeout(() => router.push('/game'), 2000);
    } else {
      if (newAttempts >= 2) {
        const gameState = loadGameState();
        if (gameState) {
          updatePlayerProgress(gameState, playerId, 'meaning', 10);
        }
        setMessage('✗ FAILED - RETURNING TO BASE [+10 pts]');
        setTimeout(() => router.push('/game'), 2000);
      } else {
        setMessage('✗ INCORRECT - 1 attempt remaining');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border-2 border-cyan-400 p-6 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold">GREEK TRANSLATION PROTOCOL</div>
            <div className="text-sm opacity-70">[PLAYER 2 - LINGUISTICS STATION]</div>
          </div>
        </div>

        <div className="border border-cyan-400 p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="text-sm">ANCIENT GREEK WORD:</div>
            <div className="text-4xl font-bold tracking-widest p-6 bg-black border border-cyan-400">
              {puzzle.word}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-center">SELECT THE CORRECT MEANING:</div>
            <div className="grid grid-cols-1 gap-3">
              {puzzle.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={attempts >= 2}
                  className="border-2 border-cyan-400 px-6 py-4 text-lg hover:bg-cyan-400 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed text-left"
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>
          </div>

          {message && (
            <div className={`text-center text-lg font-bold ${message.includes('✓') ? 'text-green-400' : 'text-red-500'}`}>
              {message}
            </div>
          )}

          <div className="text-sm text-center">ATTEMPTS: {attempts}/2</div>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/game')}
            className="border border-cyan-400 px-6 py-2 text-sm hover:bg-cyan-400 hover:text-black transition-all"
          >
            ← RETURN TO BASE
          </button>
        </div>
      </div>
    </div>
  );
}
