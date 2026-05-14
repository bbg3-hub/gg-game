'use client';

import React from 'react';
import { SpaceshipGameSession, Player } from '@/lib/spaceshipGameSession';
import { ROOM_CONFIGS } from '@/lib/roomConfig';

interface SpaceshipGameHUDProps {
  gameState: SpaceshipGameSession;
  player: Player;
  onClueClick: () => void;
}

export function SpaceshipGameHUD({ gameState, player, onClueClick }: SpaceshipGameHUDProps) {
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getHealthColor = (health: number): string => {
    if (health > 75) return 'text-green-400';
    if (health > 50) return 'text-yellow-400';
    if (health > 25) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAmmoColor = (ammo: number): string => {
    if (ammo > 20) return 'text-green-400';
    if (ammo > 10) return 'text-yellow-400';
    if (ammo > 0) return 'text-orange-400';
    return 'text-red-400';
  };

  const roomConfig = ROOM_CONFIGS[gameState.currentRoom];
  const roomProgress = Math.floor((gameState.roomProgress.currentRoomIndex / 5) * 100);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        {/* Left Panel - Player Stats */}
        <div className="bg-black bg-opacity-80 border border-cyan-400 rounded-lg p-4 min-w-48">
          <h3 className="text-cyan-400 font-mono text-sm mb-2">{player.name}</h3>
          
          {/* Health */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>HEALTH</span>
              <span className={getHealthColor(player.health)}>{player.health}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-600 to-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, player.health)}%` }}
              ></div>
            </div>
          </div>

          {/* Ammo */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>AMMO</span>
              <span className={getAmmoColor(player.ammo)}>{player.ammo}/30</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-600 to-green-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, (player.ammo / 30) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Kills */}
          <div className="text-xs text-gray-300">
            <div className="flex justify-between">
              <span>KILLS</span>
              <span className="text-green-400">{player.kills.total}</span>
            </div>
            <div className="flex justify-between">
              <span>ACCURACY</span>
              <span className="text-blue-400">{player.accuracy.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Center Panel - Game Info */}
        <div className="bg-black bg-opacity-80 border border-yellow-400 rounded-lg p-4 text-center min-w-64">
          <h2 className="text-yellow-400 font-mono text-lg mb-2">{roomConfig.name}</h2>
          <p className="text-gray-300 text-xs mb-3">{roomConfig.description}</p>
          
          {/* Room Progress */}
          <div className="mb-2">
            <div className="text-xs text-gray-300 mb-1">PROGRESS</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-600 to-yellow-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${roomProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {gameState.roomProgress.currentRoomIndex}/5
            </div>
          </div>

          {/* Status */}
          <div className="text-xs">
            {gameState.status === 'room_clearing' && (
              <span className="text-red-400 animate-pulse">⚠️ COMBAT ACTIVE</span>
            )}
            {gameState.status === 'clue_decoding' && !gameState.clueSolved && (
              <span className="text-yellow-400">📝 CLUE REQUIRED</span>
            )}
            {gameState.clueSolved && gameState.status !== 'victory' && (
              <span className="text-green-400">✅ ROOM CLEAR</span>
            )}
            {gameState.victory && (
              <span className="text-green-400 text-lg">🏆 VICTORY</span>
            )}
            {gameState.defeat && (
              <span className="text-red-400 text-lg">💀 DEFEAT</span>
            )}
          </div>
        </div>

        {/* Right Panel - Oxygen & Game State */}
        <div className="bg-black bg-opacity-80 border border-green-400 rounded-lg p-4 text-center min-w-48">
          {/* Oxygen Timer */}
          <div className="mb-3">
            <div className="text-xs text-gray-300 mb-1">OXYGEN</div>
            <div className={`text-2xl font-mono font-bold ${
              gameState.oxygenRemaining < 60000 ? 'text-red-400 animate-pulse' : 'text-green-400'
            }`}>
              {formatTime(gameState.oxygenRemaining)}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
              <div 
                className={`h-1 rounded-full transition-all duration-1000 ${
                  gameState.oxygenRemaining < 60000 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.max(0, (gameState.oxygenRemaining / (gameState.config.oxygenTime * 60 * 1000)) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Monster Count */}
          <div className="text-xs text-gray-300 mb-2">
            <div>MONSTERS: <span className="text-red-400">{gameState.monsters.length}</span></div>
            <div>TOTAL KILLS: <span className="text-green-400">{gameState.totalKills}</span></div>
          </div>

          {/* Clue Button */}
          {gameState.status === 'clue_decoding' && !gameState.clueSolved && (
            <button
              onClick={onClueClick}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-mono text-xs px-3 py-1 rounded pointer-events-auto transition-colors"
            >
              DECODE CLUE
            </button>
          )}
        </div>
      </div>

      {/* Bottom HUD - Team Status */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <div className="bg-black bg-opacity-80 border border-blue-400 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-blue-400 font-mono text-sm">TEAM STATUS</span>
            <span className="text-gray-400 text-xs">
              {gameState.players.filter(p => p.status === 'alive').length}/{gameState.players.length} ALIVE
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            {gameState.players.map((p, index) => (
              <div
                key={p.id}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                  p.status === 'alive' ? 'bg-green-900 text-green-300' : 
                  p.status === 'dead' ? 'bg-red-900 text-red-300' : 
                  'bg-gray-900 text-gray-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span className="font-mono">{p.name}</span>
                <span className="text-xs">HP:{p.health}</span>
                {p.status === 'dead' && (
                  <span className="text-red-400">☠</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mini-map (Top Right) */}
      <div className="absolute top-4 right-4 w-32 h-24 bg-black bg-opacity-80 border border-purple-400 rounded pointer-events-auto">
        <div className="p-1">
          <div className="text-xs text-purple-400 font-mono text-center mb-1">RADAR</div>
          <div className="relative w-full h-16 bg-gray-900 rounded">
            {/* Players */}
            {gameState.players.map((p, index) => {
              if (p.status !== 'alive') return null;
              const x = (p.position.x / 800) * 100;
              const y = (p.position.y / 600) * 100;
              return (
                <div
                  key={p.id}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={p.name}
                />
              );
            })}
            
            {/* Monsters */}
            {gameState.monsters.slice(0, 10).map((m, index) => {
              const x = (m.position.x / 800) * 100;
              const y = (m.position.y / 600) * 100;
              return (
                <div
                  key={m.id}
                  className="absolute w-1 h-1 bg-red-400 rounded-full"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={`${m.type} T${m.tier}`}
                />
              );
            })}
            
            {/* Room indicators */}
            <div className="absolute bottom-1 left-1 text-xs text-gray-400">
              {gameState.currentRoom.replace('_', ' ').substring(0, 6)}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Help (Mobile) */}
      {window.innerWidth <= 768 && (
        <div className="absolute bottom-20 left-4 right-4 pointer-events-auto">
          <div className="bg-black bg-opacity-80 border border-gray-600 rounded p-2">
            <div className="text-xs text-gray-400 text-center">
              LEFT: MOVE | RIGHT: SHOOT | TOP-RIGHT: RELOAD
            </div>
          </div>
        </div>
      )}

      {/* Desktop Controls Help */}
      {window.innerWidth > 768 && (
        <div className="absolute bottom-4 right-4 pointer-events-auto">
          <div className="bg-black bg-opacity-80 border border-gray-600 rounded p-2">
            <div className="text-xs text-gray-400 text-center">
              WASD: MOVE | SPACE: SHOOT | R: RELOAD
            </div>
          </div>
        </div>
      )}
    </div>
  );
}