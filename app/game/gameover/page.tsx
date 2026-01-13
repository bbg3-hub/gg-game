'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadGameState, clearGameState } from '@/lib/gameLogic';
import type { GameState } from '@/lib/gameLogic';

export default function GameOverPage() {
  const router = useRouter();
  const [gameState] = useState<GameState | null>(() => loadGameState());

  useEffect(() => {
    if (!gameState) {
      router.push('/');
      return;
    }
  }, [gameState, router]);

  const handlePlayAgain = () => {
    clearGameState();
    router.push('/');
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono">LOADING...</div>
      </div>
    );
  }

  const totalScore = gameState.players.reduce((sum, p) => sum + p.totalScore, 0);
  const completedPuzzles = gameState.players.filter(
    (p) => p.morseCompleted && p.meaningCompleted && p.miniGameCompleted && p.bonusCompleted
  ).length;

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-2 border-red-500 p-8 shadow-[0_0_30px_rgba(255,0,0,0.8)] animate-pulse">
          <div className="text-center space-y-4">
            <div className="text-5xl font-bold text-red-500">
              ✗ MISSION FAILED ✗
            </div>
            <div className="text-xl">OXYGEN DEPLETED</div>
            <div className="text-sm opacity-70">[SYSTEM CRITICAL FAILURE]</div>
          </div>
        </div>

        <div className="border border-red-500 p-6 space-y-6 bg-red-500/5">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold">MISSION SUMMARY</div>
            <div className="text-sm opacity-70">The crew did not complete the escape in time</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="border border-cyan-400 p-4">
              <div className="text-sm opacity-70">CREW MEMBERS READY</div>
              <div className="text-3xl font-bold mt-2">{completedPuzzles}/4</div>
            </div>
            <div className="border border-cyan-400 p-4">
              <div className="text-sm opacity-70">TOTAL SCORE</div>
              <div className="text-3xl font-bold mt-2">{totalScore}</div>
            </div>
          </div>
        </div>

        <div className="border border-cyan-400 p-6 space-y-4">
          <div className="text-lg font-bold text-center mb-4">CREW STATUS</div>
          {gameState.players.map((player, index) => (
            <div
              key={player.id}
              className="border p-4"
              style={{ borderColor: player.color }}
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-bold" style={{ color: player.color }}>
                    {player.name.toUpperCase()} - CREW {index + 1}
                  </div>
                  <div className="text-xs opacity-70">Score: {player.totalScore} pts</div>
                </div>
                <div className="text-sm">
                  {player.morseCompleted && player.meaningCompleted && 
                   player.miniGameCompleted && player.bonusCompleted ? (
                    <span className="text-green-400">✓ READY</span>
                  ) : (
                    <span className="text-red-500">✗ INCOMPLETE</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className={player.morseCompleted ? 'text-green-400' : 'text-red-500'}>
                  {player.morseCompleted ? '✓' : '✗'} MORSE
                </div>
                <div className={player.meaningCompleted ? 'text-green-400' : 'text-red-500'}>
                  {player.meaningCompleted ? '✓' : '✗'} GREEK
                </div>
                <div className={player.miniGameCompleted ? 'text-green-400' : 'text-red-500'}>
                  {player.miniGameCompleted ? '✓' : '✗'} DRONES
                </div>
                <div className={player.bonusCompleted ? 'text-green-400' : 'text-red-500'}>
                  {player.bonusCompleted ? '✓' : '✗'} BONUS
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-yellow-400 p-4 bg-yellow-400/10">
          <div className="text-center space-y-2">
            <div className="text-sm font-bold text-yellow-400">POST-MORTEM ANALYSIS</div>
            <div className="text-xs">
              {completedPuzzles === 4 
                ? 'All crew puzzles were completed, but the final sequence was not entered correctly in time.'
                : `Only ${completedPuzzles} out of 4 crew members completed their puzzles before oxygen ran out.`
              }
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handlePlayAgain}
            className="border-2 border-cyan-400 px-12 py-4 text-xl font-bold hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)]"
          >
            &gt;&gt; TRY AGAIN &lt;&lt;
          </button>
        </div>

        <div className="text-center text-xs opacity-70">
          <p>[MISSION TERMINATED - RETRY PROTOCOL AVAILABLE]</p>
        </div>
      </div>
    </div>
  );
}
