'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { ClickTargetsConfig } from '@/lib/mini-games';

interface ClickTargetsGameProps {
  config: ClickTargetsConfig;
  onComplete: (score: number, details: Record<string, any>) => void;
  onTimeUpdate?: (timeRemaining: number) => void;
}

interface Target {
  id: string;
  x: number;
  y: number;
  clicked: boolean;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'random';
  points?: number;
}

export default function ClickTargetsGame({ config, onComplete, onTimeUpdate }: ClickTargetsGameProps) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(config.timeLimit || 30);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [combo, setCombo] = useState(0);
  const [misses, setMisses] = useState(0);
  const [perfectHits, setPerfectHits] = useState(0);

  const gameConfig = config.config;
  const { visualTheme } = config;

  // Initialize targets
  const initializeTargets = useCallback(() => {
    const newTargets: Target[] = [];
    for (let i = 0; i < gameConfig.targetCount; i++) {
      const isRandomShape = gameConfig.targetShape === 'random';
      const shape = isRandomShape 
        ? (Math.random() > 0.5 ? 'circle' : 'square')
        : gameConfig.targetShape;
        
      newTargets.push({
        id: `target-${i}`,
        x: Math.random() * 80 + 10, // 10-90% of container width
        y: Math.random() * 80 + 10, // 10-90% of container height
        clicked: false,
        size: gameConfig.targetSize,
        color: gameConfig.targetColor,
        shape,
      });
    }
    setTargets(newTargets);
  }, [gameConfig]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setMisses(0);
    setPerfectHits(0);
    initializeTargets();
  };

  // Handle target click
  const handleTargetClick = (targetId: string) => {
    if (gameState !== 'playing') return;

    setTargets(prevTargets =>
      prevTargets.map(target => {
        if (target.id === targetId && !target.clicked) {
          const basePoints = config.scoringSystem.basePoints;
          let points = basePoints;
          let isPerfect = false;

          // Calculate combo bonus
          const newCombo = combo + 1;
          const comboBonus = Math.floor(newCombo / 5) * 5; // +5 points every 5 combo
          
          // Perfect hit bonus (center of target)
          if (gameConfig.perfectHitBonus > 0) {
            isPerfect = true;
            points += gameConfig.perfectHitBonus;
          }

          setCombo(newCombo);
          setPerfectHits(prev => isPerfect ? prev + 1 : prev);

          return { ...target, clicked: true, points: points + comboBonus };
        }
        return target;
      })
    );
  };

  // Handle wrong click (clicking empty space)
  const handleMissClick = () => {
    if (gameState !== 'playing') return;

    setMisses(prev => prev + 1);
    setCombo(0);
    
    if (gameConfig.wrongClickPenalty > 0) {
      setScore(prev => Math.max(0, prev - gameConfig.wrongClickPenalty));
    }
  };

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (onTimeUpdate) onTimeUpdate(newTime);
          if (newTime <= 0) {
            setGameState('finished');
            onComplete(score, {
              totalClicks: gameConfig.targetCount,
              hits: targets.filter(t => t.clicked).length,
              misses,
              combo: Math.max(combo, 0),
              perfectHits,
              accuracy: targets.length > 0 ? (targets.filter(t => t.clicked).length / targets.length) * 100 : 0,
            });
          }
          return newTime;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState, timeRemaining, onComplete, onTimeUpdate, score, targets, misses, combo, perfectHits]);

  // Check if all targets clicked
  useEffect(() => {
    if (gameState === 'playing') {
      const clickedCount = targets.filter(t => t.clicked).length;
      if (clickedCount === targets.length) {
        // All targets clicked - game complete
        const finalScore = targets.reduce((sum, target) => sum + (target.points || 0), 0);
        setGameState('finished');
        onComplete(finalScore, {
          totalClicks: targets.length,
          hits: clickedCount,
          misses,
          combo: Math.max(combo, 0),
          perfectHits,
          accuracy: 100,
          completedEarly: true,
        });
      }
    }
  }, [targets, gameState, onComplete, misses, combo, perfectHits]);

  // Update score when targets are clicked
  useEffect(() => {
    const newScore = targets.reduce((sum, target) => sum + (target.points || 0), 0);
    setScore(newScore);
  }, [targets]);

  return (
    <div 
      className="relative w-full h-96 border-2 rounded-lg overflow-hidden"
      style={{ 
        backgroundColor: visualTheme.backgroundColor,
        borderColor: visualTheme.primaryColor 
      }}
      onClick={handleMissClick}
    >
      {/* Game UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="flex space-x-4">
          <div 
            className="px-3 py-1 rounded font-bold"
            style={{ 
              backgroundColor: visualTheme.primaryColor,
              color: visualTheme.textColor 
            }}
          >
            Score: {score}
          </div>
          <div 
            className="px-3 py-1 rounded font-bold"
            style={{ 
              backgroundColor: visualTheme.secondaryColor,
              color: visualTheme.textColor 
            }}
          >
            Time: {timeRemaining}s
          </div>
          <div 
            className="px-3 py-1 rounded font-bold"
            style={{ 
              backgroundColor: combo > 10 ? visualTheme.accentColor : visualTheme.secondaryColor,
              color: visualTheme.textColor 
            }}
          >
            Combo: {combo}
          </div>
        </div>
        <div className="text-sm" style={{ color: visualTheme.textColor }}>
          {targets.filter(t => t.clicked).length} / {targets.length} targets
        </div>
      </div>

      {/* Game State Overlay */}
      {gameState !== 'playing' && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center">
            {gameState === 'waiting' && (
              <>
                <h2 
                  className="text-2xl font-bold mb-4"
                  style={{ color: visualTheme.primaryColor }}
                >
                  Click Targets Game
                </h2>
                <p className="mb-4" style={{ color: visualTheme.textColor }}>
                  Click on all the targets as quickly as possible!
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded font-bold transition-all"
                  style={{ 
                    backgroundColor: visualTheme.primaryColor,
                    color: visualTheme.textColor 
                  }}
                >
                  START GAME
                </button>
              </>
            )}
            {gameState === 'finished' && (
              <>
                <h2 
                  className="text-2xl font-bold mb-4"
                  style={{ color: visualTheme.primaryColor }}
                >
                  Game Complete!
                </h2>
                <div className="space-y-2" style={{ color: visualTheme.textColor }}>
                  <div>Final Score: {score}</div>
                  <div>Targets Hit: {targets.filter(t => t.clicked).length}/{targets.length}</div>
                  <div>Accuracy: {targets.length > 0 ? Math.round((targets.filter(t => t.clicked).length / targets.length) * 100) : 0}%</div>
                  <div>Best Combo: {combo}</div>
                  <div>Perfect Hits: {perfectHits}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Targets */}
      {targets.map((target) => (
        <div
          key={target.id}
          className={`absolute cursor-pointer transition-all duration-200 ${
            target.clicked ? 'opacity-30 scale-75' : 'opacity-100 scale-100'
          }`}
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            width: target.size,
            height: target.size,
            backgroundColor: target.clicked ? '#999' : target.color,
            borderRadius: target.shape === 'circle' ? '50%' : '0%',
            transform: 'translate(-50%, -50%)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleTargetClick(target.id);
          }}
        >
          {!target.clicked && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
      ))}

      {/* Combo Indicator */}
      {combo > 5 && gameState === 'playing' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-15">
          <div 
            className="text-4xl font-bold animate-pulse"
            style={{ color: visualTheme.accentColor }}
          >
            COMBO x{combo}!
          </div>
        </div>
      )}

      {/* Perfect Hit Indicator */}
      {perfectHits > 0 && gameState === 'playing' && (
        <div className="absolute bottom-4 right-4 z-10">
          <div 
            className="text-sm font-bold animate-bounce"
            style={{ color: visualTheme.accentColor }}
          >
            ⚡ Perfect Hits: {perfectHits}
          </div>
        </div>
      )}
    </div>
  );
}