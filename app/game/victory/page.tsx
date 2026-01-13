'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadGameState, clearGameState, formatTime, getRemainingTime } from '@/lib/gameLogic';
import { formatSequence } from '@/lib/sequenceCalculator';
import type { GameState } from '@/lib/gameLogic';

export default function VictoryPage() {
  const router = useRouter();
  const [gameState] = useState<GameState | null>(() => loadGameState());
  const [timeUsed] = useState<string>(() => {
    const state = loadGameState();
    if (state) {
      const remaining = getRemainingTime(state.startTime, state.oxygenMinutes);
      const used = state.oxygenMinutes * 60 * 1000 - remaining;
      return formatTime(used);
    }
    return '';
  });

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
  const avgScore = Math.floor(totalScore / gameState.players.length);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-2 border-green-400 p-8 shadow-[0_0_30px_rgba(0,255,0,0.8)] animate-pulse">
          <div className="text-center space-y-4">
            <div className="text-5xl font-bold text-green-400">
              ✓ MISSION SUCCESS ✓
            </div>
            <div className="text-xl">ESCAPE PODS LAUNCHED!</div>
            <div className="text-sm opacity-70">[ALL CREW MEMBERS EVACUATED]</div>
          </div>
        </div>

        <div className="border border-cyan-400 p-6 space-y-6">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">MISSION STATISTICS</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="border border-cyan-400 p-4">
              <div className="text-sm opacity-70">TIME USED</div>
              <div className="text-3xl font-bold mt-2">{timeUsed}</div>
            </div>
            <div className="border border-cyan-400 p-4">
              <div className="text-sm opacity-70">TOTAL SCORE</div>
              <div className="text-3xl font-bold mt-2">{totalScore}</div>
            </div>
            <div className="border border-cyan-400 p-4">
              <div className="text-sm opacity-70">AVERAGE SCORE</div>
              <div className="text-3xl font-bold mt-2">{avgScore}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-lg font-bold text-center mb-4">CREW PERFORMANCE</div>
            {gameState.players.map((player, index) => (
              <div
                key={player.id}
                className="border p-4 grid grid-cols-2 md:grid-cols-5 gap-2"
                style={{ borderColor: player.color }}
              >
                <div className="col-span-2 md:col-span-1">
                  <div className="font-bold" style={{ color: player.color }}>
                    {player.name.toUpperCase()}
                  </div>
                  <div className="text-xs opacity-70">CREW MEMBER {index + 1}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-70">MORSE</div>
                  <div className="font-bold">{player.morseScore}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-70">GREEK</div>
                  <div className="font-bold">{player.meaningScore}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-70">DRONES</div>
                  <div className="font-bold">{player.miniGameScore}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-70">BONUS</div>
                  <div className="font-bold">{player.bonusScore}</div>
                </div>
              </div>
            ))}
          </div>

          {gameState.finalSequence && gameState.finalSequence.length > 0 && (
            <div className="border border-yellow-400 p-4 bg-yellow-400/10">
              <div className="text-center">
                <div className="text-sm opacity-70">LAUNCH SEQUENCE USED</div>
                <div className="text-3xl font-bold text-yellow-400 mt-2 tracking-widest">
                  {formatSequence(gameState.finalSequence)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border border-green-400 p-6 bg-green-400/5">
          <div className="text-center space-y-4">
            <div className="text-lg">The crew has successfully escaped the failing space station!</div>
            <div className="text-sm opacity-70">
              All puzzles completed, launch sequence verified, and escape pods deployed.
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handlePlayAgain}
            className="border-2 border-cyan-400 px-12 py-4 text-xl font-bold hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)]"
          >
            &gt;&gt; NEW MISSION &lt;&lt;
          </button>
        </div>

        <div className="text-center text-xs opacity-70">
          <p>[MISSION COMPLETE - AWAITING NEW ASSIGNMENT]</p>
        </div>
      </div>
    </div>
  );
}
