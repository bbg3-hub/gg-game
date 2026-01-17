'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { MemoryMatchConfig } from '@/lib/mini-games';

interface MemoryMatchGameProps {
  config: MemoryMatchConfig;
  onComplete: (score: number, details: Record<string, any>) => void;
  onTimeUpdate?: (timeRemaining: number) => void;
}

interface Card {
  id: string;
  matchId: string;
  isFlipped: boolean;
  isMatched: string | null;
  image?: string;
}

export default function MemoryMatchGame({ config, onComplete, onTimeUpdate }: MemoryMatchGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(config.timeLimit || 120);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'finished'>('waiting');
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [showAllTime, setShowAllTime] = useState(0);

  const gameConfig = config.config;
  const { visualTheme } = config;

  // Initialize game
  const initializeGame = useCallback(() => {
    const newCards: Card[] = [];
    const { gridSize } = gameConfig;
    
    let gridRows = 2;
    let gridCols = 2;
    
    if (gridSize === '4x4') {
      gridRows = 4;
      gridCols = 4;
    } else if (gridSize === '6x6') {
      gridRows = 6;
      gridCols = 6;
    }
    
    const totalCards = gridRows * gridCols;
    const pairCount = totalCards / 2;
    
    // Generate pairs
    for (let i = 0; i < pairCount; i++) {
      const matchId = `pair-${i}`;
      
      // Create two cards for each pair
      newCards.push({
        id: `card-${i}-1`,
        matchId,
        isFlipped: false,
        isMatched: null,
      });
      
      newCards.push({
        id: `card-${i}-2`,
        matchId,
        isFlipped: false,
        isMatched: null,
      });
    }
    
    // Shuffle cards
    const shuffled = newCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    
    // Show all cards initially if configured
    if (gameConfig.showAllTime && gameConfig.showAllTime > 0) {
      setShowAllTime(gameConfig.showAllTime);
      setTimeout(() => {
        setCards(prevCards => 
          prevCards.map(card => ({ ...card, isFlipped: false }))
        );
      }, gameConfig.showAllTime * 1000);
    }
  }, [gameConfig]);

  // Start game
  const startGame = () => {
    setGameState('playing');
    initializeGame();
  };

  // Handle card click
  const handleCardClick = (cardId: string) => {
    if (gameState !== 'playing') return;
    if (showAllTime > 0) return; // Don't allow clicks during reveal time
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched !== null) return;
    
    const newFlippedCards = [...flippedCards, card];
    
    // Flip the card
    setCards(prevCards =>
      prevCards.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );
    
    setFlippedCards(newFlippedCards);
    setMoves(prev => prev + 1);
    
    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      
      setTimeout(() => {
        if (first.matchId === second.matchId) {
          // Match found
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === first.id || c.id === second.id
                ? { ...c, isMatched: first.matchId }
                : c
            )
          );
          
          setMatches(prev => prev + 1);
          setScore(prev => prev + config.scoringSystem.basePoints * 2);
        } else {
          // No match - flip cards back
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === first.id || c.id === second.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          
          // Time penalty for wrong attempt
          if (gameConfig.timePenalty > 0) {
            setTimeRemaining(prev => Math.max(0, prev - gameConfig.timePenalty));
          }
        }
        
        setFlippedCards([]);
      }, 1000);
    }
  };

  // Check for game completion
  useEffect(() => {
    const totalPairs = cards.length / 2;
    if (matches === totalPairs && totalPairs > 0) {
      setGameState('finished');
      
      // Calculate bonus points
      let bonusScore = 0;
      if (config.scoringSystem.bonusConditions?.includes('perfect-match') && moves === totalPairs) {
        bonusScore = gameConfig.perfectMatchBonus || 50;
      }
      
      const finalScore = score + bonusScore;
      onComplete(finalScore, {
        totalPairs,
        matches: matches,
        moves,
        perfect: moves === totalPairs,
        timeRemaining,
        accuracy: (matches / totalPairs) * 100,
        bonusScore,
      });
    }
  }, [matches, cards.length, score, moves, gameConfig.perfectMatchBonus, config.scoringSystem.bonusConditions, timeRemaining, onComplete]);

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && showAllTime === 0 && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (onTimeUpdate) onTimeUpdate(newTime);
          if (newTime <= 0) {
            setGameState('finished');
            const accuracy = cards.length > 0 ? (matches / (cards.length / 2)) * 100 : 0;
            onComplete(score, {
              totalPairs: cards.length / 2,
              matches,
              moves,
              accuracy,
              timeExpired: true,
            });
          }
          return newTime;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState, timeRemaining, onTimeUpdate, score, matches, moves, cards.length, onComplete]);

  // Countdown for show all time
  useEffect(() => {
    if (showAllTime > 0) {
      const timer = setTimeout(() => {
        setShowAllTime(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showAllTime]);

  const getGridClass = () => {
    switch (gameConfig.gridSize) {
      case '2x2':
        return 'grid-cols-2';
      case '4x4':
        return 'grid-cols-4';
      case '6x6':
        return 'grid-cols-6';
      default:
        return 'grid-cols-2';
    }
  };

  const renderCard = (card: Card) => {
    const isFlipped = card.isFlipped || card.isMatched !== null || showAllTime > 0;
    
    return (
      <div
        key={card.id}
        className={`aspect-square cursor-pointer transition-all duration-300 ${
          isFlipped ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
        } ${card.isMatched ? 'opacity-75' : ''}`}
        onClick={() => handleCardClick(card.id)}
        style={{
          backgroundColor: isFlipped ? visualTheme.primaryColor : visualTheme.secondaryColor,
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          {isFlipped ? (
            <div 
              className="w-8 h-8 rounded-full"
              style={{ 
                backgroundColor: card.isMatched ? visualTheme.accentColor : visualTheme.backgroundColor 
              }}
            >
              {card.isMatched && <span className="text-xs">✓</span>}
            </div>
          ) : (
            <div className="text-gray-400">?</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="p-4 rounded-lg"
      style={{ backgroundColor: visualTheme.backgroundColor }}
    >
      {/* Game UI */}
      <div className="flex justify-between items-center mb-4">
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
              backgroundColor: visualTheme.accentColor,
              color: visualTheme.textColor 
            }}
          >
            Matches: {matches}/{cards.length / 2}
          </div>
        </div>
        
        <div className="text-sm" style={{ color: visualTheme.textColor }}>
          Moves: {moves}
        </div>
      </div>

      {/* Show All Time Countdown */}
      {showAllTime > 0 && (
        <div className="text-center mb-4">
          <div 
            className="text-2xl font-bold"
            style={{ color: visualTheme.primaryColor }}
          >
            Memorize the cards! {showAllTime}
          </div>
        </div>
      )}

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
                  Memory Match Game
                </h2>
                <p className="mb-4" style={{ color: visualTheme.textColor }}>
                  Match pairs of cards by remembering their positions!
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
                  <div>Matches: {matches}/{cards.length / 2}</div>
                  <div>Moves: {moves}</div>
                  <div>Accuracy: {cards.length > 0 ? Math.round((matches / (cards.length / 2)) * 100) : 0}%</div>
                  {moves === cards.length / 2 && (
                    <div className="text-yellow-400">Perfect Game!</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Card Grid */}
      <div className={`grid ${getGridClass()} gap-2 max-w-2xl mx-auto`}>
        {cards.map(renderCard)}
      </div>
    </div>
  );
}