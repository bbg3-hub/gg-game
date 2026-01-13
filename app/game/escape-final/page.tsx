'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadGameState, saveGameState } from '@/lib/gameLogic';
import { calculateFinalSequence, validateSequence } from '@/lib/sequenceCalculator';
import type { GameState } from '@/lib/gameLogic';

export default function EscapeFinalPage() {
  const router = useRouter();
  const [gameState] = useState<GameState | null>(() => {
    const state = loadGameState();
    if (state) {
      const finalSequence = calculateFinalSequence(state.players);
      const updatedState = { ...state, finalSequence };
      saveGameState(updatedState);
      return updatedState;
    }
    return null;
  });
  const [sequence] = useState<number[]>(() => {
    const state = loadGameState();
    if (state) {
      return calculateFinalSequence(state.players);
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!gameState) {
      router.push('/game/setup');
      return;
    }

    const allComplete = gameState.players.every(
      (p) => p.morseCompleted && p.meaningCompleted && p.miniGameCompleted && p.bonusCompleted
    );

    if (!allComplete) {
      router.push('/game');
      return;
    }
  }, [gameState, router]);

  const handleSubmit = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (validateSequence(input, sequence)) {
      setMessage('✓ SEQUENCE VERIFIED - LAUNCHING ESCAPE PODS!');
      setTimeout(() => router.push('/game/victory'), 2000);
    } else {
      if (newAttempts >= 3) {
        setMessage('✗ SEQUENCE FAILED - OXYGEN DEPLETED');
        setTimeout(() => router.push('/game/gameover'), 2000);
      } else {
        setMessage(`✗ INCORRECT SEQUENCE - ${3 - newAttempts} attempts remaining`);
      }
    }
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-2 border-cyan-400 p-6 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold">FINAL LAUNCH SEQUENCE</div>
            <div className="text-sm opacity-70">[CRITICAL: 3 ATTEMPTS ONLY]</div>
          </div>
        </div>

        <div className="border border-yellow-400 p-6 space-y-4 bg-yellow-400/5">
          <div className="text-center space-y-4">
            <div className="text-lg font-bold text-yellow-400">CREW PERFORMANCE SUMMARY</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gameState.players.map((player) => (
                <div key={player.id} className="border border-cyan-400 p-4">
                  <div className="text-sm font-bold" style={{ color: player.color }}>
                    {player.name.toUpperCase()}
                  </div>
                  <div className="text-2xl font-bold mt-2">{player.totalScore}</div>
                  <div className="text-xs opacity-70">TOTAL POINTS</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-cyan-400 p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="text-sm">CALCULATE THE 6-DIGIT LAUNCH SEQUENCE</div>
            <div className="text-xs opacity-70 max-w-md mx-auto">
              The sequence is derived from crew performance scores. Use the hint system if needed.
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter 6-digit sequence (e.g., 1-2-3-4-5-6)"
              className="w-full bg-black border-2 border-cyan-400 px-6 py-4 text-cyan-400 text-2xl text-center font-bold focus:outline-none focus:shadow-[0_0_20px_rgba(0,255,255,0.5)] placeholder-cyan-700 placeholder:text-base"
              disabled={attempts >= 3}
              maxLength={20}
            />
          </div>

          {message && (
            <div className={`text-center text-lg font-bold ${message.includes('✓') ? 'text-green-400' : 'text-red-500'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm">ATTEMPTS: {attempts}/3</div>
            <div className="space-x-2">
              <button
                onClick={() => setShowHint(!showHint)}
                className="border border-cyan-400 px-4 py-2 text-sm hover:bg-cyan-400 hover:text-black transition-all"
              >
                {showHint ? 'HIDE HINT' : 'SHOW HINT'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={attempts >= 3 || !input.trim()}
                className="border-2 border-yellow-400 px-8 py-2 text-lg font-bold hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                LAUNCH
              </button>
            </div>
          </div>

          {showHint && (
            <div className="border border-cyan-400 p-4 bg-black/50 space-y-2 text-sm">
              <div className="font-bold text-yellow-400">CALCULATION HINTS:</div>
              <ul className="space-y-1 ml-4">
                <li>→ Digit 1-3: Based on total score sum</li>
                <li>→ Digit 4: Based on score difference (max - min)</li>
                <li>→ Digit 5: Based on average score</li>
                <li>→ Digit 6: Based on morse puzzle scores</li>
              </ul>
              <div className="text-xs opacity-70 mt-2">
                Each calculation uses modulo 10 operation for single digits.
              </div>
            </div>
          )}
        </div>

        <div className="border border-red-500 p-4 bg-red-500/10">
          <div className="text-center text-sm">
            <span className="text-red-500">[CRITICAL WARNING]</span> Failure will result in mission termination.
          </div>
        </div>
      </div>
    </div>
  );
}
