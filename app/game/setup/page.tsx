'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeGame } from '@/lib/gameLogic';

export default function SetupPage() {
  const router = useRouter();
  const [playerNames, setPlayerNames] = useState(['', '', '', '']);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const validNames = playerNames.filter((name) => name.trim() !== '');
    if (validNames.length !== 4) {
      alert('All 4 crew members must be identified!');
      return;
    }
    
    initializeGame(validNames);
    router.push('/game');
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="border-2 border-cyan-400 p-8 space-y-6 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold">
              &gt;&gt; CREW IDENTIFICATION PROTOCOL &lt;&lt;
            </div>
            <div className="text-sm opacity-70">
              [Enter crew member designations]
            </div>
          </div>

          <div className="space-y-4">
            {playerNames.map((name, index) => (
              <div key={index} className="space-y-2">
                <label className="block text-sm">
                  CREW MEMBER {index + 1}:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Enter name for Player ${index + 1}`}
                  className="w-full bg-black border border-cyan-400 px-4 py-3 text-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] placeholder-cyan-700"
                  maxLength={20}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleStart}
              className="border-2 border-cyan-400 px-12 py-4 text-xl font-bold hover:bg-cyan-400 hover:text-black transition-all duration-200 shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)]"
            >
              &gt;&gt; BEGIN MISSION &lt;&lt;
            </button>
          </div>

          <div className="text-center text-xs opacity-70 mt-4">
            <p>[WARNING: OXYGEN TIMER STARTS IMMEDIATELY]</p>
          </div>
        </div>
      </div>
    </div>
  );
}
