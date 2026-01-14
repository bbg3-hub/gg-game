'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SpaceshipGameSession, Player } from '@/lib/spaceshipGameSession';
import { ROOM_CONFIGS } from '@/lib/roomConfig';

interface SpaceshipGameMonitorProps {
  session: SpaceshipGameSession;
  onAdminAction: (sessionId: string, action: string, data?: any) => void;
}

export function SpaceshipGameMonitor({ session, onAdminAction }: SpaceshipGameMonitorProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'monsters' | 'players' | 'controls'>('overview');
  const [minimapSize, setMinimapSize] = useState({ width: 300, height: 200 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Update minimap size based on viewport
  useEffect(() => {
    const updateSize = () => {
      setMinimapSize({ width: 300, height: 200 });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Draw minimap
  const drawMinimap = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = minimapSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw room background
    const roomConfig = ROOM_CONFIGS[session.currentRoom];
    if (roomConfig) {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      
      switch (session.currentRoom) {
        case 'CRYO_BAY':
          gradient.addColorStop(0, '#1a1a2e');
          gradient.addColorStop(0.5, '#16213e');
          gradient.addColorStop(1, '#0f3460');
          break;
        case 'MED_BAY':
          gradient.addColorStop(0, '#2d1b3d');
          gradient.addColorStop(0.5, '#1a1a2e');
          gradient.addColorStop(1, '#0f3460');
          break;
        case 'ENGINEERING':
          gradient.addColorStop(0, '#3d1a1b');
          gradient.addColorStop(0.5, '#2d1b3d');
          gradient.addColorStop(1, '#1a1a2e');
          break;
        case 'BRIDGE':
          gradient.addColorStop(0, '#1a3d1a');
          gradient.addColorStop(0.5, '#2d1b3d');
          gradient.addColorStop(1, '#3d1a1b');
          break;
        case 'COMMAND_CENTER':
          gradient.addColorStop(0, '#0d0d0d');
          gradient.addColorStop(0.25, '#2d1b3d');
          gradient.addColorStop(0.5, '#3d1a1b');
          gradient.addColorStop(0.75, '#1a1a2e');
          gradient.addColorStop(1, '#0f3460');
          break;
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Scale factors for mapping game coordinates to minimap
    const scaleX = width / 800;
    const scaleY = height / 600;

    // Draw players
    session.players.forEach(player => {
      if (player.status === 'alive') {
        const x = player.position.x * scaleX;
        const y = player.position.y * scaleY;
        
        // Player color based on player number
        const colors = ['#00ffff', '#ff6600', '#00ff00', '#ff00ff'];
        const color = colors[player.playerNumber] || '#ffffff';
        
        ctx.fillStyle = color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Player label
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(player.name.substring(0, 3), x, y - 8);
      }
    });

    // Draw monsters
    session.monsters.forEach(monster => {
      const x = monster.position.x * scaleX;
      const y = monster.position.y * scaleY;
      
      // Monster color based on tier
      const colors = ['#666666', '#ffaa00', '#ff6600', '#ff0000', '#aa00ff'];
      const color = colors[monster.tier - 1] || '#666666';
      
      ctx.fillStyle = color;
      ctx.shadowBlur = monster.isBoss ? 15 : 5;
      ctx.shadowColor = color;
      ctx.beginPath();
      
      if (monster.isBoss) {
        // Boss: larger diamond
        ctx.moveTo(x, y - 6);
        ctx.lineTo(x + 6, y);
        ctx.lineTo(x, y + 6);
        ctx.lineTo(x - 6, y);
      } else {
        // Regular monster: circle
        ctx.arc(x, y, 3, 0, Math.PI * 2);
      }
      ctx.fill();
      
      ctx.shadowBlur = 0;
    });

    // Draw room border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      drawMinimap(ctx);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [session, minimapSize]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTierStats = () => {
    const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    session.monsters.forEach(monster => {
      stats[monster.tier]++;
    });
    return stats;
  };

  const tierStats = getTierStats();

  return (
    <div className="bg-gray-900 rounded-lg border border-cyan-400">
      {/* Header */}
      <div className="border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-mono font-bold text-cyan-400">{session.config.name}</h2>
            <p className="text-gray-400 font-mono">Code: {session.gameCode}</p>
          </div>
          <div className="text-right">
            <div className={`px-3 py-1 rounded font-mono text-sm ${
              session.victory ? 'bg-green-900 text-green-300' :
              session.defeat ? 'bg-red-900 text-red-300' :
              session.status === 'active' ? 'bg-blue-900 text-blue-300' :
              'bg-gray-700 text-gray-300'
            }`}>
              {session.victory ? 'VICTORY' :
               session.defeat ? 'DEFEAT' :
               session.status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-700">
        <div className="flex">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'monsters', label: 'Monsters', icon: '👹' },
            { id: 'players', label: 'Players', icon: '👥' },
            { id: 'controls', label: 'Controls', icon: '🎮' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-1 px-4 py-3 font-mono text-sm transition-colors ${
                selectedTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Minimap */}
            <div className="bg-black border border-gray-600 rounded-lg p-4">
              <h3 className="text-cyan-400 font-mono text-sm mb-3">REAL-TIME MINIMAP</h3>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={minimapSize.width}
                  height={minimapSize.height}
                  className="border border-gray-500 rounded"
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-xs font-mono text-gray-400">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                    <span>Players ({session.players.filter(p => p.status === 'alive').length}/{session.players.length})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span>Monsters ({session.monsters.length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span>Bosses ({session.monsters.filter(m => m.isBoss).length})</span>
                  </div>
                </div>
                <div>
                  <div>Room: <span className="text-yellow-400">{session.currentRoom.replace('_', ' ')}</span></div>
                  <div>Progress: <span className="text-green-400">{session.roomProgress.completed.length}/5</span></div>
                  <div>Kills: <span className="text-purple-400">{session.totalKills}</span></div>
                </div>
              </div>
            </div>

            {/* Game Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black border border-green-400 rounded-lg p-4">
                <h4 className="text-green-400 font-mono text-sm mb-2">⏱️ OXYGEN</h4>
                <div className={`text-2xl font-mono font-bold ${
                  session.oxygenRemaining < 60000 ? 'text-red-400 animate-pulse' : 'text-green-400'
                }`}>
                  {formatTime(session.oxygenRemaining)}
                </div>
              </div>
              
              <div className="bg-black border border-yellow-400 rounded-lg p-4">
                <h4 className="text-yellow-400 font-mono text-sm mb-2">👹 MONSTERS</h4>
                <div className="text-2xl font-mono font-bold text-red-400">{session.monsters.length}</div>
                <div className="text-xs text-gray-400 font-mono mt-1">
                  T1:{tierStats[1]} T2:{tierStats[2]} T3:{tierStats[3]} T4:{tierStats[4]} T5:{tierStats[5]}
                </div>
              </div>
              
              <div className="bg-black border border-purple-400 rounded-lg p-4">
                <h4 className="text-purple-400 font-mono text-sm mb-2">🎯 ACCURACY</h4>
                <div className="text-2xl font-mono font-bold text-blue-400">
                  {session.players.length > 0 
                    ? (session.players.reduce((sum, p) => sum + p.accuracy, 0) / session.players.length).toFixed(1)
                    : '0.0'}%
                </div>
              </div>
            </div>

            {/* Room Progress */}
            <div className="bg-black border border-blue-400 rounded-lg p-4">
              <h4 className="text-blue-400 font-mono text-sm mb-3">🗺️ ROOM PROGRESS</h4>
              <div className="space-y-2">
                {['CRYO_BAY', 'MED_BAY', 'ENGINEERING', 'BRIDGE', 'COMMAND_CENTER'].map((room, index) => {
                  const completed = session.roomProgress.completed.includes(room as any);
                  const current = session.currentRoom === room;
                  const next = index === session.roomProgress.currentRoomIndex + 1 && !current;
                  
                  return (
                    <div key={room} className="flex items-center justify-between">
                      <span className={`font-mono text-sm ${
                        completed ? 'text-green-400' : 
                        current ? 'text-yellow-400' : 
                        next ? 'text-blue-400' :
                        'text-gray-500'
                      }`}>
                        {room.replace('_', ' ')}
                      </span>
                      <div className="flex gap-2">
                        {completed && <span className="text-green-400">✅</span>}
                        {current && <span className="text-yellow-400 animate-pulse">🔄</span>}
                        {next && <span className="text-blue-400">➡️</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'monsters' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-red-400 font-mono text-lg">MONSTER ANALYSIS</h3>
              <button
                onClick={() => onAdminAction(session.id, 'spawn_monsters', { type: 'CRAWLER', tier: 1 })}
                className="bg-red-600 hover:bg-red-700 text-white font-mono px-3 py-1 rounded text-sm"
              >
                SPAWN TEST MONSTER
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {session.monsters.map(monster => (
                <div key={monster.id} className="bg-black border border-gray-600 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-mono font-bold">
                        {monster.type.replace('_', ' ')} T{monster.tier}
                      </h4>
                      {monster.isBoss && (
                        <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-mono">BOSS</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-mono font-bold">{monster.health}/{monster.maxHealth}</div>
                      {monster.bossPhase && (
                        <div className="text-yellow-400 text-xs font-mono">P{monster.bossPhase}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 font-mono space-y-1">
                    <div>Pos: ({monster.position.x.toFixed(0)}, {monster.position.y.toFixed(0)})</div>
                    <div>Effects: {Object.entries(monster.effects).filter(([_, active]) => active).map(([effect, _]) => effect).join(', ') || 'None'}</div>
                  </div>
                  
                  <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(0, (monster.health / monster.maxHealth) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {session.monsters.length === 0 && (
              <div className="text-center py-8 text-gray-400 font-mono">
                🕷️ No monsters currently active
              </div>
            )}
          </div>
        )}

        {selectedTab === 'players' && (
          <div className="space-y-4">
            <h3 className="text-cyan-400 font-mono text-lg">PLAYER STATUS</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {session.players.map(player => (
                <div key={player.id} className="bg-black border border-gray-600 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-mono font-bold">{player.name}</h4>
                      <span className="text-gray-400 text-sm font-mono">Player {player.playerNumber + 1}</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-mono ${
                      player.status === 'alive' ? 'bg-green-900 text-green-300' :
                      player.status === 'dead' ? 'bg-red-900 text-red-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {player.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div>
                      <div className="text-gray-400">Health</div>
                      <div className={`font-bold ${player.health > 50 ? 'text-green-400' : player.health > 25 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {player.health}/100
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Ammo</div>
                      <div className={`font-bold ${player.ammo > 10 ? 'text-blue-400' : 'text-red-400'}`}>
                        {player.ammo}/30
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Kills</div>
                      <div className="text-purple-400 font-bold">{player.kills.total}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Accuracy</div>
                      <div className="text-yellow-400 font-bold">{player.accuracy.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-400 font-mono">
                    <div>Position: ({player.position.x.toFixed(0)}, {player.position.y.toFixed(0)})</div>
                    <div>Damage: {player.damageDealt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'controls' && (
          <div className="space-y-6">
            <h3 className="text-yellow-400 font-mono text-lg">ADMIN CONTROLS</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Game Control */}
              <div className="bg-black border border-yellow-400 rounded-lg p-4">
                <h4 className="text-yellow-400 font-mono font-bold mb-3">🎮 GAME CONTROL</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onAdminAction(session.id, session.status === 'setup' ? 'resume' : 'pause')}
                    className={`w-full font-mono py-2 px-4 rounded transition-colors ${
                      session.status === 'setup'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    {session.status === 'setup' ? '▶️ RESUME GAME' : '⏸️ PAUSE GAME'}
                  </button>
                  
                  <button
                    onClick={() => onAdminAction(session.id, 'skip_room')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono py-2 px-4 rounded transition-colors"
                  >
                    ⏭️ SKIP ROOM
                  </button>
                  
                  <button
                    onClick={() => onAdminAction(session.id, 'reveal_clue')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-mono py-2 px-4 rounded transition-colors"
                  >
                    💡 REVEAL CLUE
                  </button>
                </div>
              </div>

              {/* Oxygen Control */}
              <div className="bg-black border border-green-400 rounded-lg p-4">
                <h4 className="text-green-400 font-mono font-bold mb-3">⏱️ OXYGEN CONTROL</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onAdminAction(session.id, 'adjust_oxygen', { seconds: 60 })}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-mono py-2 px-4 rounded transition-colors"
                  >
                    ➕ +1 MINUTE
                  </button>
                  
                  <button
                    onClick={() => onAdminAction(session.id, 'adjust_oxygen', { seconds: 180 })}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-mono py-2 px-4 rounded transition-colors"
                  >
                    ➕➕ +3 MINUTES
                  </button>
                  
                  <button
                    onClick={() => onAdminAction(session.id, 'adjust_oxygen', { seconds: -60 })}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-mono py-2 px-4 rounded transition-colors"
                  >
                    ➖ -1 MINUTE
                  </button>
                </div>
              </div>

              {/* End Game */}
              <div className="bg-black border border-red-400 rounded-lg p-4">
                <h4 className="text-red-400 font-mono font-bold mb-3">💀 END GAME</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onAdminAction(session.id, 'force_victory')}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-mono py-2 px-4 rounded transition-colors"
                  >
                    🏆 FORCE VICTORY
                  </button>
                  
                  <button
                    onClick={() => onAdminAction(session.id, 'force_defeat')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-mono py-2 px-4 rounded transition-colors"
                  >
                    💀 FORCE DEFEAT
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-black border border-red-900 rounded-lg p-4">
                <h4 className="text-red-400 font-mono font-bold mb-3">⚠️ DANGER ZONE</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onAdminAction(session.id, 'delete_session')}
                    className="w-full bg-red-900 hover:bg-red-800 text-red-300 font-mono py-2 px-4 rounded transition-colors border border-red-600"
                  >
                    🗑️ DELETE SESSION
                  </button>
                  <div className="text-xs text-red-300 font-mono">
                    This action cannot be undone!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}