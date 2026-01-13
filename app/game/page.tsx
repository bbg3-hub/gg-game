'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadGameState, formatTime, getRemainingTime, checkGameOver } from '@/lib/gameLogic';
import type { GameState } from '@/lib/gameLogic';

export default function GamePage() {
  const router = useRouter();
  const [gameState] = useState<GameState | null>(() => loadGameState());
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (!gameState) {
      router.push('/game/setup');
      return;
    }
  }, [gameState, router]);

  useEffect(() => {
    if (!gameState) return;

    const interval = setInterval(() => {
      const remaining = getRemainingTime(gameState.startTime, gameState.oxygenMinutes);
      setTimeRemaining(remaining);

      if (checkGameOver(gameState)) {
        clearInterval(interval);
        router.push('/game/gameover');
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gameState, router]);

  if (!gameState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono">LOADING...</div>
      </div>
    );
  }

  const allPuzzlesComplete = gameState.players.every(
    (p) => p.morseCompleted && p.meaningCompleted && p.miniGameCompleted && p.bonusCompleted
  );

  const handleEscapeClick = () => {
    if (!allPuzzlesComplete) {
      alert('All crew members must complete their puzzles first!');
      return;
    }
    router.push('/game/escape');
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="border-2 border-cyan-400 p-6 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold">MISSION CONTROL</div>
              <div className="text-sm opacity-70">[Station Systems Terminal]</div>
            </div>
            <div className="text-right">
              <div className="text-sm">OXYGEN REMAINING:</div>
              <div className={`text-3xl font-bold ${timeRemaining < 60000 ? 'text-red-500 animate-pulse' : ''}`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gameState.players.map((player, index) => (
            <div
              key={player.id}
              className="border-2 p-6 space-y-4"
              style={{ borderColor: player.color }}
            >
              <div className="text-xl font-bold" style={{ color: player.color }}>
                {player.name.toUpperCase()} - CREW {index + 1}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>MORSE PROTOCOL:</span>
                  <span className={player.morseCompleted ? 'text-green-400' : 'text-red-500'}>
                    {player.morseCompleted ? `✓ [${player.morseScore}pts]` : '✗ INCOMPLETE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GREEK TRANSLATION:</span>
                  <span className={player.meaningCompleted ? 'text-green-400' : 'text-red-500'}>
                    {player.meaningCompleted ? `✓ [${player.meaningScore}pts]` : '✗ INCOMPLETE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>DRONE NEUTRALIZATION:</span>
                  <span className={player.miniGameCompleted ? 'text-green-400' : 'text-red-500'}>
                    {player.miniGameCompleted ? `✓ [${player.miniGameScore}pts]` : '✗ INCOMPLETE'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>BONUS PROTOCOLS:</span>
                  <span className={player.bonusCompleted ? 'text-green-400' : 'text-red-500'}>
                    {player.bonusCompleted ? `✓ [${player.bonusScore}pts]` : '✗ INCOMPLETE'}
                  </span>
                </div>
                <div className="border-t border-cyan-400 pt-2 flex justify-between font-bold">
                  <span>TOTAL SCORE:</span>
                  <span>{player.totalScore} pts</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href={`/game/${player.id}/morse`}
                  className={`border px-3 py-2 text-center hover:bg-cyan-400 hover:text-black transition-all ${
                    player.morseCompleted ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ borderColor: player.color }}
                >
                  MORSE
                </Link>
                <Link
                  href={`/game/${player.id}/meaning`}
                  className={`border px-3 py-2 text-center hover:bg-cyan-400 hover:text-black transition-all ${
                    player.meaningCompleted ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ borderColor: player.color }}
                >
                  GREEK
                </Link>
                <Link
                  href={`/game/${player.id}/mini-game`}
                  className={`border px-3 py-2 text-center hover:bg-cyan-400 hover:text-black transition-all ${
                    player.miniGameCompleted ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ borderColor: player.color }}
                >
                  DRONES
                </Link>
                <Link
                  href={`/game/${player.id}/bonus`}
                  className={`border px-3 py-2 text-center hover:bg-cyan-400 hover:text-black transition-all ${
                    player.bonusCompleted ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ borderColor: player.color }}
                >
                  BONUS
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="border-2 border-yellow-400 p-6">
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold text-yellow-400">ESCAPE POD ACCESS</div>
            <div className="text-sm">
              {allPuzzlesComplete
                ? '[ALL SYSTEMS READY - PROCEED TO ESCAPE]'
                : '[LOCKED - COMPLETE ALL CREW PUZZLES]'}
            </div>
            <button
              onClick={handleEscapeClick}
              disabled={!allPuzzlesComplete}
              className={`border-2 border-yellow-400 px-12 py-4 text-xl font-bold transition-all duration-200 ${
                allPuzzlesComplete
                  ? 'hover:bg-yellow-400 hover:text-black shadow-[0_0_15px_rgba(255,255,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,0,0.8)]'
                  : 'opacity-30 cursor-not-allowed'
              }`}
            >
              &gt;&gt; INITIATE ESCAPE SEQUENCE &lt;&lt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
