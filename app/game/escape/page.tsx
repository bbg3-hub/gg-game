'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadGameState } from '@/lib/gameLogic';
import type { GameState } from '@/lib/gameLogic';

export default function EscapePage() {
  const router = useRouter();
  const [gameState] = useState<GameState | null>(() => loadGameState());
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [message, setMessage] = useState('');

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

  const handleSlotClick = (slotIndex: number) => {
    if (selectedSlots.includes(slotIndex)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slotIndex));
    } else if (selectedSlots.length < 4) {
      setSelectedSlots([...selectedSlots, slotIndex]);
    }
  };

  const handleContinue = () => {
    if (selectedSlots.length !== 4) {
      setMessage('You must select exactly 4 fragment slots!');
      return;
    }

    router.push('/game/escape-final');
  };

  if (!gameState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-mono">LOADING...</div>
      </div>
    );
  }

  const fragments = [
    { id: 1, code: 'FRAG-ALPHA', status: 'ACTIVE' },
    { id: 2, code: 'FRAG-BETA', status: 'ACTIVE' },
    { id: 3, code: 'FRAG-GAMMA', status: 'ACTIVE' },
    { id: 4, code: 'FRAG-DELTA', status: 'ACTIVE' },
    { id: 5, code: 'FRAG-EPSILON', status: 'CORRUPTED' },
    { id: 6, code: 'FRAG-ZETA', status: 'CORRUPTED' },
  ];

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-2 border-cyan-400 p-6 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold">ESCAPE FRAGMENT COLLECTION</div>
            <div className="text-sm opacity-70">[SEQUENCE ASSEMBLY REQUIRED]</div>
          </div>
        </div>

        <div className="border border-cyan-400 p-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="text-lg font-bold">ALL CREW PUZZLES COMPLETED!</div>
            <div className="text-sm">Select 4 active fragments to proceed</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {fragments.map((fragment, index) => {
              const isSelected = selectedSlots.includes(index);
              const isActive = fragment.status === 'ACTIVE';
              
              return (
                <button
                  key={fragment.id}
                  onClick={() => isActive && handleSlotClick(index)}
                  disabled={!isActive}
                  className={`border-2 p-6 transition-all ${
                    isActive
                      ? isSelected
                        ? 'border-green-400 bg-green-400/20 shadow-[0_0_15px_rgba(0,255,0,0.5)]'
                        : 'border-cyan-400 hover:border-cyan-300 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                      : 'border-red-500 opacity-30 cursor-not-allowed'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-lg font-bold">{fragment.code}</div>
                    <div className="text-xs">
                      {isActive ? (
                        <span className="text-green-400">● {fragment.status}</span>
                      ) : (
                        <span className="text-red-500">● {fragment.status}</span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="text-green-400 text-sm font-bold">
                        SELECTED #{selectedSlots.indexOf(index) + 1}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <div className="text-sm mb-4">
              SELECTED: {selectedSlots.length}/4
            </div>
            {message && (
              <div className="text-red-500 mb-4">{message}</div>
            )}
            <button
              onClick={handleContinue}
              disabled={selectedSlots.length !== 4}
              className="border-2 border-yellow-400 px-12 py-4 text-xl font-bold hover:bg-yellow-400 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,0,0.8)]"
            >
              &gt;&gt; PROCEED TO FINAL SEQUENCE &lt;&lt;
            </button>
          </div>
        </div>

        <div className="border border-yellow-400 p-4 bg-yellow-400/10">
          <div className="text-center text-sm">
            <span className="text-yellow-400">[WARNING]</span> The final launch sequence will be calculated from all crew scores.
          </div>
        </div>
      </div>
    </div>
  );
}
