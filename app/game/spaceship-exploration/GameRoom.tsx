'use client';

import React, { useEffect, useState } from 'react';
import { GameRoom as GameRoomType } from '@/lib/gameConfig';
import { ROOM_CONFIGS } from '@/lib/roomConfig';

interface GameRoomProps {
  currentRoom: GameRoomType;
  isActive: boolean;
}

export function GameRoom({ currentRoom, isActive }: GameRoomProps) {
  const [showNarrative, setShowNarrative] = useState(true);
  const [currentNarrativeIndex, setCurrentNarrativeIndex] = useState(0);
  const [showCombat, setShowCombat] = useState(false);
  
  const roomConfig = ROOM_CONFIGS[currentRoom];

  // Generate particle positions once on mount
  const [particlePositions] = useState(() => 
    Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`
    }))
  );

  useEffect(() => {
    if (showNarrative && roomConfig) {
      const timer = setTimeout(() => {
        if (currentNarrativeIndex < roomConfig.narrative.length - 1) {
          setCurrentNarrativeIndex(prev => prev + 1);
        } else {
          // All narrative shown, transition to combat
          setTimeout(() => {
            setShowNarrative(false);
            setShowCombat(true);
          }, 1500);
        }
      }, 3000); // 3 seconds per narrative line

      return () => clearTimeout(timer);
    }
  }, [showNarrative, currentNarrativeIndex, roomConfig]);

  if (!roomConfig) {
    return null;
  }

  return (
    <>
      {/* Room Entry Cinematic */}
      {showNarrative && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          <div className="max-w-2xl mx-auto p-8 text-center">
            {/* Room Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-mono font-bold text-cyan-400 mb-2">
                {roomConfig.name}
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto"></div>
            </div>

            {/* Narrative Text */}
            <div className="mb-8 min-h-[120px] flex items-center justify-center">
              <p className="text-xl text-gray-300 font-mono leading-relaxed">
                {roomConfig.narrative[currentNarrativeIndex]}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex justify-center space-x-2">
                {roomConfig.narrative.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      index <= currentNarrativeIndex
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Skip Option */}
            <button
              onClick={() => {
                setShowNarrative(false);
                setShowCombat(true);
              }}
              className="text-gray-500 hover:text-gray-300 text-sm font-mono transition-colors"
            >
              Press SPACE to skip...
            </button>
          </div>
        </div>
      )}

      {/* Combat Active Indicator */}
      {showCombat && isActive && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <div className="bg-red-600 bg-opacity-90 border-2 border-red-400 px-6 py-3 rounded-lg animate-pulse">
            <div className="text-center">
              <div className="text-white font-mono text-xl font-bold mb-1">⚠️ COMBAT ACTIVE ⚠️</div>
              <div className="text-red-100 text-sm font-mono">
                Eliminate all hostile entities
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ambient Room Effects */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Room-specific background effects */}
        {currentRoom === 'CRYO_BAY' && (
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-cyan-900/20 animate-pulse"></div>
        )}
        
        {currentRoom === 'MED_BAY' && (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-red-900/5 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-green-500/3 animate-bounce"></div>
          </div>
        )}
        
        {currentRoom === 'ENGINEERING' && (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-yellow-600/5 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-orange-500/3 animate-ping"></div>
          </div>
        )}
        
        {currentRoom === 'BRIDGE' && (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-green-900/10 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 animate-bounce"></div>
          </div>
        )}
        
        {currentRoom === 'COMMAND_CENTER' && (
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-purple-900/20 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-red-500/10 animate-bounce"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-white/5 animate-ping"></div>
          </div>
        )}

        {/* Room Particle Effects */}
        <div className="absolute top-0 left-0 w-full h-full">
          {particlePositions.map((pos, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 opacity-30 animate-pulse"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: pos.animationDelay,
                animationDuration: pos.animationDuration
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}