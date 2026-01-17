'use client';

import React, { useState, useEffect } from 'react';
import type { MiniGameConfig, MiniGameType } from '@/lib/mini-games';
import ClickTargetsGame from './ClickTargetsGame';
import MemoryMatchGame from './MemoryMatchGame';
import MathMiniGame from './MathMiniGame';

interface GameEngineProps {
  miniGame: MiniGameConfig;
  onGameComplete: (score: number, details: Record<string, any>) => void;
  onGameProgress?: (progress: number) => void;
  className?: string;
}

export default function GameEngine({ miniGame, onGameComplete, onGameProgress, className }: GameEngineProps) {
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'completed' | 'error'>('loading');
  const [currentScore, setCurrentScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(miniGame.timeLimit || 30);

  useEffect(() => {
    // Initialize game
    setGameState('playing');
  }, [miniGame.id]);

  const handleGameComplete = (score: number, details: Record<string, any>) => {
    setCurrentScore(score);
    setGameState('completed');
    onGameComplete(score, details);
  };

  const handleTimeUpdate = (time: number) => {
    setTimeRemaining(time);
    if (onGameProgress && miniGame.timeLimit) {
      const progress = ((miniGame.timeLimit - time) / miniGame.timeLimit) * 100;
      onGameProgress(progress);
    }
  };

  const renderGame = () => {
    try {
      switch (miniGame.type) {
        case 'click-targets':
          return (
            <ClickTargetsGame
              config={miniGame}
              onComplete={handleGameComplete}
              onTimeUpdate={handleTimeUpdate}
            />
          );
        
        case 'memory-match':
          return (
            <MemoryMatchGame
              config={miniGame}
              onComplete={handleGameComplete}
              onTimeUpdate={handleTimeUpdate}
            />
          );
        
        case 'math-mini-game':
          return (
            <MathMiniGame
              config={miniGame}
              onComplete={handleGameComplete}
              onTimeUpdate={handleTimeUpdate}
            />
          );
        
        default:
          return (
            <div className="p-6 text-center">
              <div className="text-red-400 mb-4">Game type not yet implemented</div>
              <div className="text-cyan-300">
                {miniGame.type} mini-games will be available soon.
              </div>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering game:', error);
      setGameState('error');
      return (
        <div className="p-6 text-center">
          <div className="text-red-400 mb-4">Error loading game</div>
          <div className="text-cyan-300">
            There was an error loading this mini-game. Please try again.
          </div>
        </div>
      );
    }
  };

  if (gameState === 'loading') {
    return (
      <div className={`p-6 ${className || ''}`}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-yellow-400">Loading {miniGame.title}...</div>
        </div>
      </div>
    );
  }

  if (gameState === 'error') {
    return (
      <div className={`p-6 ${className || ''}`}>
        <div className="text-center">
          <div className="text-red-400 mb-4">Game Error</div>
          <div className="text-cyan-300">
            Failed to load the mini-game. Please refresh and try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className || ''}`}>
      {renderGame()}
    </div>
  );
}