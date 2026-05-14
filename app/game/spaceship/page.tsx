'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SpaceshipLobbyPage() {
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gameCode.trim() || !playerName.trim()) {
      setError('Please enter both game code and player name');
      return;
    }

    if (gameCode.length !== 6) {
      setError('Game code must be 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/spaceship-game/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameCode: gameCode.toUpperCase(),
          playerName: playerName.trim(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push(data.redirect);
      } else {
        setError(data.error || 'Failed to join game');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = () => {
    // Redirect to admin panel to create new game
    router.push('/admin/spaceship-game');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-cyan-400 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-mono font-bold text-cyan-400 mb-2">
              🚀 VOID SPIRE EXPEDITION
            </h1>
            <p className="text-xl text-gray-300 font-mono">
              4-Player Cooperative Space Station Survival
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Join Game */}
          <div className="bg-gray-900 border border-cyan-400 rounded-lg p-6">
            <h2 className="text-2xl font-mono font-bold text-cyan-400 mb-4">
              🎮 JOIN EXPEDITION
            </h2>
            
            <form onSubmit={handleJoinGame} className="space-y-4">
              <div>
                <label className="block text-cyan-400 font-mono text-sm mb-2">
                  GAME CODE
                </label>
                <input
                  type="text"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                  className="w-full bg-black border border-gray-600 rounded px-4 py-3 text-white font-mono text-xl text-center focus:border-cyan-400 focus:outline-none uppercase"
                  placeholder="ABC123"
                  maxLength={6}
                  required
                />
                <p className="text-xs text-gray-400 font-mono mt-1">
                  Enter the 6-character code provided by your expedition leader
                </p>
              </div>

              <div>
                <label className="block text-cyan-400 font-mono text-sm mb-2">
                  PLAYER NAME
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-black border border-gray-600 rounded px-4 py-3 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  placeholder="Enter your callsign"
                  maxLength={20}
                  required
                />
                <p className="text-xs text-gray-400 font-mono mt-1">
                  Your callsign will be visible to other crew members
                </p>
              </div>

              {error && (
                <div className="bg-red-900 border border-red-400 text-red-200 p-3 rounded font-mono text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-mono py-3 px-6 rounded transition-colors text-lg"
              >
                {loading ? 'CONNECTING...' : 'JOIN EXPEDITION'}
              </button>
            </form>
          </div>

          {/* Game Info */}
          <div className="space-y-6">
            <div className="bg-gray-900 border border-purple-400 rounded-lg p-6">
              <h2 className="text-2xl font-mono font-bold text-purple-400 mb-4">
                📋 MISSION BRIEFING
              </h2>
              
              <div className="space-y-4 text-sm font-mono text-gray-300">
                <div>
                  <h3 className="text-yellow-400 font-bold mb-2">🎯 OBJECTIVE</h3>
                  <p>Escape the crashed Void Spire space station before oxygen runs out.</p>
                </div>
                
                <div>
                  <h3 className="text-yellow-400 font-bold mb-2">🗺️ ROUTE</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Cryo Bay - Wake up in wreckage</li>
                    <li>Med Bay - Bio-hazard zone</li>
                    <li>Engineering - Power systems</li>
                    <li>Bridge - Command center</li>
                    <li>Command Center - Final boss fight</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-yellow-400 font-bold mb-2">👹 ENEMIES</h3>
                  <p>5-tier monster system from small crawlers to colossal bosses.</p>
                </div>
                
                <div>
                  <h3 className="text-yellow-400 font-bold mb-2">🔍 PUZZLES</h3>
                  <p>Decode clues using Morse code, Caesar cipher, binary, and more.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-green-400 rounded-lg p-6">
              <h2 className="text-2xl font-mono font-bold text-green-400 mb-4">
                🎮 CONTROLS
              </h2>
              
              <div className="grid grid-cols-2 gap-4 text-sm font-mono text-gray-300">
                <div>
                  <h3 className="text-cyan-400 font-bold mb-2">Desktop</h3>
                  <ul className="space-y-1">
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">WASD</kbd> Move</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">SPACE</kbd> Shoot</li>
                    <li><kbd className="bg-gray-700 px-2 py-1 rounded">R</kbd> Reload</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-cyan-400 font-bold mb-2">Mobile</h3>
                  <ul className="space-y-1">
                    <li>Left side: Move joystick</li>
                    <li>Right side: Shoot target</li>
                    <li>Top-right: Reload</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-orange-400 rounded-lg p-6">
              <h2 className="text-2xl font-mono font-bold text-orange-400 mb-4">
                ⚙️ DIFFICULTY
              </h2>
              
              <div className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-green-400">NORMAL</span>
                  <span className="text-gray-400">Balanced challenge</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">HARD</span>
                  <span className="text-gray-400">Increased difficulty</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-400">NIGHTMARE</span>
                  <span className="text-gray-400">Heavy T3-4 monsters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400">EXTREME</span>
                  <span className="text-gray-400">Mostly T4, VOID ENTITY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Section */}
        <div className="mt-8 text-center">
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-xl font-mono text-gray-400 mb-4">EXPEDITION LEADER?</h3>
            <button
              onClick={handleCreateGame}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-mono py-3 px-6 rounded-lg transition-colors"
            >
              CREATE NEW EXPEDITION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}