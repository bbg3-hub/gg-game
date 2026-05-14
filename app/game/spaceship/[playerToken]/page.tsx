'use client';

import React, { useEffect, useState } from 'react';
import { SpaceshipExploration } from '../../spaceship-exploration/SpaceshipExploration';
import { getPlayerByToken } from '@/lib/spaceshipGameSession';

interface SpaceshipPlayerPageProps {
  params: {
    playerToken: string;
  };
}

export default function SpaceshipPlayerPage({ params }: SpaceshipPlayerPageProps) {
  const [gameCode, setGameCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract game code from player token lookup
    const lookupGameCode = async () => {
      try {
        // In a real implementation, you'd have an API to get session by player token
        // For now, we'll parse it from the URL or session storage
        const savedGameCode = sessionStorage.getItem('spaceshipGameCode');
        
        if (!savedGameCode) {
          setError('Game session not found. Please join through the lobby.');
          setLoading(false);
          return;
        }

        setGameCode(savedGameCode);
        setLoading(false);
      } catch (err) {
        setError('Failed to load game session');
        setLoading(false);
      }
    };

    lookupGameCode();
  }, [params.playerToken]);

  const handleBackToLobby = () => {
    // Clear any session storage
    sessionStorage.removeItem('spaceshipGameCode');
    // Navigate back to lobby
    window.location.href = '/game/spaceship';
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
            onClick={handleBackToLobby}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-mono rounded"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    );
  }

  if (!gameCode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-400 font-mono mb-4">Invalid Game Session</h2>
          <p className="text-gray-400 mb-4">Please join the game through the lobby</p>
          <button
            onClick={handleBackToLobby}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-mono rounded"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    );
  }

  return (
    <SpaceshipExploration
      playerToken={params.playerToken}
      gameCode={gameCode}
      onBackToLobby={handleBackToLobby}
    />
  );
}