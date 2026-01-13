'use client';

import React, { useEffect, useState } from 'react';
import { SpaceshipGameSession, Player } from '@/lib/spaceshipGameSession';
import { formatTime } from '@/lib/spaceshipGameSession';

interface GameOverScreenProps {
  gameState: SpaceshipGameSession;
  player: Player;
  victory: boolean;
  onBackToLobby?: () => void;
}

export function GameOverScreen({ gameState, player, victory, onBackToLobby }: GameOverScreenProps) {
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // Auto-show stats after a short delay
    const timer = setTimeout(() => {
      setShowStats(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const formatTimeSpent = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  const getPerformanceRating = (): { rating: string; color: string; description: string } => {
    const totalKills = player.kills.total;
    const accuracy = player.accuracy;
    const damage = player.damageDealt;

    if (victory) {
      if (totalKills >= 20 && accuracy >= 80 && damage >= 500) {
        return { rating: 'S', color: 'text-yellow-400', description: 'Legendary Performance!' };
      } else if (totalKills >= 15 && accuracy >= 70 && damage >= 400) {
        return { rating: 'A', color: 'text-green-400', description: 'Excellent Work!' };
      } else if (totalKills >= 10 && accuracy >= 60 && damage >= 300) {
        return { rating: 'B', color: 'text-blue-400', description: 'Good Job!' };
      } else {
        return { rating: 'C', color: 'text-gray-400', description: 'Mission Complete!' };
      }
    } else {
      return { rating: 'FAILED', color: 'text-red-400', description: 'Mission Failed' };
    }
  };

  const performance = getPerformanceRating();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Main Result */}
        <div className="text-center mb-8">
          <div className="mb-6">
            {victory ? (
              <div className="text-8xl mb-4">🏆</div>
            ) : (
              <div className="text-8xl mb-4">💀</div>
            )}
          </div>
          
          <h1 className={`text-6xl font-mono font-bold mb-4 ${
            victory ? 'text-green-400' : 'text-red-400'
          }`}>
            {victory ? 'MISSION SUCCESS' : 'MISSION FAILED'}
          </h1>
          
          <p className="text-xl text-gray-300 font-mono mb-2">
            {victory 
              ? 'You have successfully escaped the Void Spire!'
              : 'The Void Spire has claimed another victim...'
            }
          </p>
          
          <p className="text-lg text-gray-400 font-mono">
            Game Code: <span className="text-cyan-400">{gameState.gameCode}</span>
          </p>
        </div>

        {/* Performance Rating */}
        <div className="text-center mb-8">
          <div className={`text-8xl font-mono font-bold ${performance.color} mb-2`}>
            {performance.rating}
          </div>
          <p className={`text-xl font-mono ${performance.color}`}>
            {performance.description}
          </p>
        </div>

        {/* Statistics */}
        {showStats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Player Stats */}
            <div className="bg-gray-900 border border-cyan-400 rounded-lg p-6">
              <h2 className="text-2xl font-mono font-bold text-cyan-400 mb-4 text-center">
                YOUR PERFORMANCE
              </h2>
              
              <div className="space-y-4">
                {/* Basic Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-white">{player.kills.total}</div>
                    <div className="text-sm text-gray-400 font-mono">Total Kills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-white">{player.accuracy.toFixed(1)}%</div>
                    <div className="text-sm text-gray-400 font-mono">Accuracy</div>
                  </div>
                </div>

                {/* Tier Breakdown */}
                <div>
                  <h3 className="text-lg font-mono text-yellow-400 mb-2">Kills by Tier:</h3>
                  <div className="grid grid-cols-5 gap-2 text-sm">
                    <div className="text-center">
                      <div className="text-white font-mono">{player.kills.tier1 || 0}</div>
                      <div className="text-gray-400 font-mono">T1</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-mono">{player.kills.tier2 || 0}</div>
                      <div className="text-gray-400 font-mono">T2</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-mono">{player.kills.tier3 || 0}</div>
                      <div className="text-gray-400 font-mono">T3</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-mono">{player.kills.tier4 || 0}</div>
                      <div className="text-gray-400 font-mono">T4</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-mono">{player.kills.tier5 || 0}</div>
                      <div className="text-gray-400 font-mono">T5</div>
                    </div>
                  </div>
                </div>

                {/* Combat Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-mono text-white">{player.totalShots}</div>
                    <div className="text-sm text-gray-400 font-mono">Shots Fired</div>
                  </div>
                  <div>
                    <div className="text-lg font-mono text-white">{player.successfulShots}</div>
                    <div className="text-sm text-gray-400 font-mono">Shots Hit</div>
                  </div>
                </div>

                <div>
                  <div className="text-lg font-mono text-white">{player.damageDealt}</div>
                  <div className="text-sm text-gray-400 font-mono">Damage Dealt</div>
                </div>

                <div>
                  <div className="text-lg font-mono text-white">{formatTimeSpent(player.timeSpent)}</div>
                  <div className="text-sm text-gray-400 font-mono">Time Spent</div>
                </div>
              </div>
            </div>

            {/* Game Stats */}
            <div className="bg-gray-900 border border-purple-400 rounded-lg p-6">
              <h2 className="text-2xl font-mono font-bold text-purple-400 mb-4 text-center">
                MISSION SUMMARY
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-white">
                      {gameState.roomProgress.completed.length}/5
                    </div>
                    <div className="text-sm text-gray-400 font-mono">Rooms Cleared</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-mono font-bold text-white">{gameState.totalKills}</div>
                    <div className="text-sm text-gray-400 font-mono">Total Kills</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-mono text-yellow-400 mb-2">Room Progress:</h3>
                  <div className="space-y-1">
                    {['CRYO_BAY', 'MED_BAY', 'ENGINEERING', 'BRIDGE', 'COMMAND_CENTER'].map((room, index) => {
                      const completed = gameState.roomProgress.completed.includes(room as any);
                      const current = gameState.currentRoom === room;
                      
                      return (
                        <div key={room} className="flex items-center justify-between text-sm">
                          <span className={`font-mono ${
                            completed ? 'text-green-400' : 
                            current ? 'text-yellow-400' : 
                            'text-gray-500'
                          }`}>
                            {room.replace('_', ' ')}
                          </span>
                          <span>
                            {completed ? '✅' : current ? '🔄' : '⏳'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-mono text-yellow-400 mb-2">Team Status:</h3>
                  <div className="space-y-2">
                    {gameState.players.map((p, index) => (
                      <div key={p.id} className="flex items-center justify-between text-sm">
                        <span className="font-mono text-white">{p.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-mono">{p.kills.total}K</span>
                          <span className={`${
                            p.status === 'alive' ? 'text-green-400' : 
                            p.status === 'dead' ? 'text-red-400' : 
                            'text-gray-400'
                          }`}>
                            {p.status === 'alive' ? '🟢' : p.status === 'dead' ? '🔴' : '⚪'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-mono text-yellow-400 mb-2">Game Settings:</h3>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span className="font-mono">Difficulty:</span>
                      <span className="font-mono text-cyan-400">{gameState.config.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono">Max Tier:</span>
                      <span className="font-mono text-cyan-400">T{gameState.config.maxMonsterTier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono">Players:</span>
                      <span className="font-mono text-cyan-400">{gameState.players.length}/{gameState.config.maxPlayers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          {onBackToLobby && (
            <button
              onClick={onBackToLobby}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-mono text-lg px-8 py-3 rounded-lg transition-colors"
            >
              RETURN TO LOBBY
            </button>
          )}
          
          <div className="text-gray-400 text-sm font-mono">
            Game completed in {formatTimeSpent(Date.now() - gameState.startTime)}
          </div>
        </div>
      </div>
    </div>
  );
}