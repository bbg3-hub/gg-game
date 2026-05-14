'use client';

import React, { useState, useEffect } from 'react';
import { GameConfig, Difficulty, MonsterTier } from '@/lib/gameConfig';
import { SpaceshipGameSession } from '@/lib/spaceshipGameSession';
import { SpaceshipGameMonitor } from './SpaceshipGameMonitor';
import { MonsterConfigPanel } from './MonsterConfigPanel';

interface SpaceshipGameAdminProps {
  adminId: string;
}

export function SpaceshipGameAdmin({ adminId }: SpaceshipGameAdminProps) {
  const [sessions, setSessions] = useState<SpaceshipGameSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<SpaceshipGameSession | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for creating new games
  const [newGame, setNewGame] = useState({
    name: '',
    description: '',
    difficulty: 'NORMAL' as const,
    maxPlayers: 4,
    oxygenTime: 15,
    maxMonsterTier: 3 as 1 | 2 | 3 | 4 | 5,
    healthMultiplier: 1.0,
    speedMultiplier: 1.0,
    damageMultiplier: 1.0,
    spawnRateMultiplier: 1.0,
    bossSelection: 'AUTO' as const
  });

  // Load sessions
  const loadSessions = async () => {
    try {
      const response = await fetch(`/api/spaceship-game/admin/sessions?adminId=${adminId}`);
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions);
      } else {
        setError(data.error || 'Failed to load sessions');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
    
    // Auto-refresh sessions every 5 seconds
    const interval = setInterval(loadSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  // Create new game
  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/spaceship-game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId,
          config: newGame
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowCreateForm(false);
        setNewGame({
          name: '',
          description: '',
          difficulty: 'NORMAL',
          maxPlayers: 4,
          oxygenTime: 15,
          maxMonsterTier: 3,
          healthMultiplier: 1.0,
          speedMultiplier: 1.0,
          damageMultiplier: 1.0,
          spawnRateMultiplier: 1.0,
          bossSelection: 'AUTO'
        });
        await loadSessions();
      } else {
        setError(data.error || 'Failed to create game');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  // Delete session
  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
      const response = await fetch(`/api/spaceship-game/admin/actions?sessionId=${sessionId}&adminId=${adminId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        await loadSessions();
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null);
        }
      } else {
        setError(data.error || 'Failed to delete session');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  // Admin action
  const handleAdminAction = async (sessionId: string, action: string, data?: any) => {
    try {
      const response = await fetch('/api/spaceship-game/admin/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          adminId,
          action,
          data
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        await loadSessions();
        if (selectedSession?.id === sessionId) {
          setSelectedSession(result.session);
        }
      } else {
        setError(result.error || 'Action failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <h2 className="text-xl text-cyan-400 font-mono">Loading Spaceship Games...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-cyan-400 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-mono font-bold text-cyan-400">VOID SPIRE CONTROL</h1>
              <p className="text-gray-400 font-mono">Spaceship Exploration Game Admin</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-mono px-6 py-3 rounded-lg transition-colors"
            >
              CREATE NEW GAME
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-400 text-red-200 p-4 m-4 rounded">
          <p className="font-mono">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white font-mono px-3 py-1 rounded text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4">
        {selectedSession ? (
          // Game Monitor View
          <div>
            <div className="mb-4">
              <button
                onClick={() => setSelectedSession(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-mono px-4 py-2 rounded transition-colors"
              >
                ← Back to Sessions
              </button>
            </div>
            <SpaceshipGameMonitor
              session={selectedSession}
              onAdminAction={handleAdminAction}
            />
          </div>
        ) : (
          // Sessions List View
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-mono font-bold text-cyan-400 mb-2">Active Sessions</h2>
              <p className="text-gray-400 font-mono">
                {sessions.length} total sessions
              </p>
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-mono text-gray-400 mb-2">No Active Sessions</h3>
                <p className="text-gray-500 font-mono mb-4">Create a new game to get started</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-mono px-6 py-3 rounded-lg transition-colors"
                >
                  Create First Game
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-cyan-400 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-mono font-bold text-white">{session.config.name}</h3>
                        <p className="text-cyan-400 font-mono">Code: {session.gameCode}</p>
                      </div>
                      <div className={`px-3 py-1 rounded text-sm font-mono ${
                        session.victory ? 'bg-green-900 text-green-300' :
                        session.defeat ? 'bg-red-900 text-red-300' :
                        session.status === 'room_clearing' || session.status === 'clue_decoding' ? 'bg-blue-900 text-blue-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {session.victory ? 'VICTORY' :
                         session.defeat ? 'DEFEAT' :
                         session.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm font-mono text-gray-300 mb-4">
                      <div className="flex justify-between">
                        <span>Players:</span>
                        <span className="text-cyan-400">{session.players.length}/{session.config.maxPlayers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Room:</span>
                        <span className="text-yellow-400">{session.currentRoom.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Oxygen:</span>
                        <span className={`${
                          session.oxygenRemaining < 60000 ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {formatTime(session.oxygenRemaining)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kills:</span>
                        <span className="text-purple-400">{session.totalKills}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <span className="text-orange-400">{session.config.difficulty}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-mono py-2 px-4 rounded transition-colors text-sm"
                      >
                        MONITOR
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-mono py-2 px-4 rounded transition-colors text-sm"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Game Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-cyan-400 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-mono font-bold text-cyan-400 mb-6 text-center">
              CREATE NEW GAME
            </h2>

            <form onSubmit={handleCreateGame} className="space-y-4">
              {/* Basic Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-400 font-mono text-sm mb-2">Game Name</label>
                  <input
                    type="text"
                    value={newGame.name}
                    onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                    placeholder="Void Spire Expedition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-cyan-400 font-mono text-sm mb-2">Max Players</label>
                  <select
                    value={newGame.maxPlayers}
                    onChange={(e) => setNewGame({ ...newGame, maxPlayers: parseInt(e.target.value) })}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num} Players</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-cyan-400 font-mono text-sm mb-2">Description</label>
                <input
                  type="text"
                  value={newGame.description}
                  onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                  className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  placeholder="4-player cooperative space station survival"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-400 font-mono text-sm mb-2">Difficulty</label>
                  <select
                    value={newGame.difficulty}
                    onChange={(e) => setNewGame({ ...newGame, difficulty: e.target.value as any })}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HARD">Hard</option>
                    <option value="NIGHTMARE">Nightmare</option>
                    <option value="EXTREME">Extreme</option>
                  </select>
                </div>
                <div>
                  <label className="block text-cyan-400 font-mono text-sm mb-2">Oxygen Time (minutes)</label>
                  <input
                    type="number"
                    value={newGame.oxygenTime}
                    onChange={(e) => setNewGame({ ...newGame, oxygenTime: parseInt(e.target.value) })}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                    min="5"
                    max="60"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-400 font-mono text-sm mb-2">Max Monster Tier</label>
                  <select
                    value={newGame.maxMonsterTier}
                    onChange={(e) => setNewGame({ ...newGame, maxMonsterTier: parseInt(e.target.value) as MonsterTier })}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5].map(tier => (
                      <option key={tier} value={tier}>Tier {tier}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-cyan-400 font-mono text-sm mb-2">Boss Selection</label>
                  <select
                    value={newGame.bossSelection}
                    onChange={(e) => setNewGame({ ...newGame, bossSelection: e.target.value as any })}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white font-mono focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="AUTO">Auto</option>
                    <option value="CHARGER_WARLORD">Charger Warlord</option>
                    <option value="SPITTER_QUEEN">Spitter Hive Queen</option>
                    <option value="ABOMINATION">Elder Abomination</option>
                    <option value="VOID_ENTITY">Void Entity</option>
                  </select>
                </div>
              </div>

              {/* Monster Configuration */}
              <div>
                <h3 className="text-lg font-mono font-bold text-yellow-400 mb-3">Monster Configuration</h3>
                <MonsterConfigPanel config={newGame} onChange={setNewGame} />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-mono py-3 px-6 rounded transition-colors"
                >
                  CREATE GAME
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-mono py-3 px-6 rounded transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}