'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ActiveMonster, Player, SpaceshipGameSession } from '@/lib/spaceshipGameSession';
import { GameRoom as GameRoomComponent } from './GameRoom';
import { PixelGameCanvas } from './PixelGameCanvas';
import { SpaceshipGameHUD } from './SpaceshipGameHUD';
import { ClueDecoder } from './ClueDecoder';
import { GameOverScreen } from './GameOverScreen';

interface SpaceshipExplorationProps {
  playerToken: string;
  gameCode: string;
  onBackToLobby?: () => void;
}

export function SpaceshipExploration({ playerToken, gameCode, onBackToLobby }: SpaceshipExplorationProps) {
  const [gameState, setGameState] = useState<SpaceshipGameSession | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showClue, setShowClue] = useState(false);
  const [gamePhase, setGamePhase] = useState<'playing' | 'clue' | 'victory' | 'defeat'>('playing');
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const syncGameState = useCallback(async () => {
    try {
      const response = await fetch(`/api/spaceship-game/${gameCode}/sync`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to sync game state');
      }

      const data = await response.json();
      
      if (data.success) {
        setGameState(data.game);
        setPlayer(data.player);
        
        // Update game phase
        if (data.game.victory) {
          setGamePhase('victory');
        } else if (data.game.defeat) {
          setGamePhase('defeat');
        } else if (data.game.status === 'clue_decoding' || data.game.clueSolved) {
          setGamePhase('clue');
        } else {
          setGamePhase('playing');
        }
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Sync error:', err);
      setError(err instanceof Error ? err.message : 'Sync failed');
    }
  }, [gameCode]);

  const sendAction = useCallback(async (action: string, data?: unknown) => {
    try {
      const response = await fetch(`/api/spaceship-game/${gameCode}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerToken,
          action,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send action');
      }

      const result = await response.json();
      
      if (result.success) {
        setGameState(result.game);
        setPlayer(result.player);
        return result;
      } else {
        throw new Error(result.error || 'Action failed');
      }
    } catch (err) {
      console.error('Action error:', err);
      setError(err instanceof Error ? err.message : 'Action failed');
      return null;
    }
  }, [gameCode, playerToken]);

  // Initial load
  useEffect(() => {
    const loadGame = async () => {
      setLoading(true);
      await syncGameState();
      setLoading(false);
    };

    loadGame();
  }, [syncGameState]);

  // Set up automatic syncing
  useEffect(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    syncIntervalRef.current = setInterval(() => {
      syncGameState();
    }, 100); // Sync every 100ms for smooth gameplay

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [syncGameState]);

  // Handle clue submission
  const handleClueSubmit = async (answer: string) => {
    if (!gameState) return;

    try {
      const response = await fetch('/api/spaceship-game/decode-clue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerToken,
          sessionId: gameState.id,
          answer,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        if (result.correct) {
          setShowClue(false);
          setGamePhase('playing');
        }
        // Refresh game state
        await syncGameState();
      }
    } catch (err) {
      console.error('Clue submission error:', err);
      setError('Failed to submit clue answer');
    }
  };

  // Handle player movement
  const handlePlayerMove = (position: { x: number; y: number }) => {
    sendAction('move', { position });
  };

  // Handle shooting
  const handlePlayerShoot = (targetX: number, targetY: number) => {
    sendAction('shoot', { targetX, targetY });
  };

  // Handle reload
  const handleReload = () => {
    sendAction('reload');
  };

  // Handle clue button click
  const handleClueClick = () => {
    if (gameState?.status === 'clue_decoding' && !gameState.clueSolved) {
      setShowClue(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <h2 className="text-xl text-cyan-400 font-mono">Connecting to Void Spire...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-400 font-mono mb-4">Connection Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono rounded"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!gameState || !player) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-400 font-mono">Game Not Found</h2>
          <p className="text-gray-400 mb-4">Unable to load game state</p>
          {onBackToLobby && (
            <button
              onClick={onBackToLobby}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-mono rounded"
            >
              Back to Lobby
            </button>
          )}
        </div>
      </div>
    );
  }

  // Victory screen
  if (gamePhase === 'victory') {
    return (
      <GameOverScreen
        gameState={gameState}
        player={player}
        victory={true}
        onBackToLobby={onBackToLobby}
      />
    );
  }

  // Defeat screen
  if (gamePhase === 'defeat') {
    return (
      <GameOverScreen
        gameState={gameState}
        player={player}
        victory={false}
        onBackToLobby={onBackToLobby}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Game Canvas */}
      <PixelGameCanvas
        gameState={gameState}
        player={player}
        onPlayerMove={handlePlayerMove}
        onPlayerShoot={handlePlayerShoot}
        onReload={handleReload}
      />

      {/* HUD Overlay */}
      <SpaceshipGameHUD
        gameState={gameState}
        player={player}
        onClueClick={handleClueClick}
      />

      {/* Clue Decoder Modal */}
      {showClue && gameState.status === 'clue_decoding' && (
        <ClueDecoder
          gameState={gameState}
          onSubmit={handleClueSubmit}
          onClose={() => setShowClue(false)}
        />
      )}

      {/* Room Narrative */}
      <GameRoomComponent
        currentRoom={gameState.currentRoom}
        isActive={gameState.status === 'room_clearing'}
      />
    </div>
  );
}