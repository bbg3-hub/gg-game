'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { ActiveMonster, Player, SpaceshipGameSession } from '@/lib/spaceshipGameSession';

interface PixelGameCanvasProps {
  gameState: SpaceshipGameSession;
  player: Player;
  onPlayerMove: (position: { x: number; y: number }) => void;
  onPlayerShoot: (targetX: number, targetY: number) => void;
  onReload: () => void;
}

interface TouchControls {
  left: { active: boolean; startX: number; startY: number; currentX: number; currentY: number };
  right: { active: boolean; targetX: number; targetY: number };
}

export function PixelGameCanvas({ gameState, player, onPlayerMove, onPlayerShoot, onReload }: PixelGameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const keysRef = useRef<Set<string>>(new Set());
  const touchControlsRef = useRef<TouchControls>({
    left: { active: false, startX: 0, startY: 0, currentX: 0, currentY: 0 },
    right: { active: false, targetX: 0, targetY: 0 }
  });

  const [isMobile, setIsMobile] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Canvas size responsive
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const aspectRatio = 4 / 3; // Standard 4:3 aspect ratio
        
        let width, height;
        if (isMobile) {
          // Mobile: Full width, height based on viewport
          width = Math.min(containerRect.width - 20, 800);
          height = width / aspectRatio;
        } else {
          // Desktop: Maintain aspect ratio
          width = Math.min(containerRect.width * 0.8, 1000);
          height = width / aspectRatio;
        }
        
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [isMobile]);

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysRef.current.add(event.key.toLowerCase());
      
      // Prevent default for game keys
      if (['w', 'a', 's', 'd', ' ', 'r', 'shift'].includes(event.key.toLowerCase())) {
        event.preventDefault();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Touch controls
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    const touches = event.touches;
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const x = touch.clientX;
      const y = touch.clientY;
      
      // Left side - movement
      if (x < window.innerWidth * 0.5) {
        touchControlsRef.current.left = {
          active: true,
          startX: x,
          startY: y,
          currentX: x,
          currentY: y
        };
      } 
      // Right side - shooting
      else {
        touchControlsRef.current.right = {
          active: true,
          targetX: x,
          targetY: y
        };
      }
    }
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    const touches = event.touches;
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const x = touch.clientX;
      const y = touch.clientY;
      
      // Left side - movement
      if (x < window.innerWidth * 0.5 && touchControlsRef.current.left.active) {
        touchControlsRef.current.left.currentX = x;
        touchControlsRef.current.left.currentY = y;
      } 
      // Right side - shooting target
      else if (x >= window.innerWidth * 0.5 && touchControlsRef.current.right.active) {
        touchControlsRef.current.right.targetX = x;
        touchControlsRef.current.right.targetY = y;
      }
    }
  }, []);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    
    // Stop movement
    touchControlsRef.current.left.active = false;
    
    // Handle shooting action
    if (touchControlsRef.current.right.active) {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const targetX = touchControlsRef.current.right.targetX - rect.left;
        const targetY = touchControlsRef.current.right.targetY - rect.top;
        onPlayerShoot(targetX, targetY);
      }
    }
    
    touchControlsRef.current.right.active = false;
  }, [onPlayerShoot]);

  const drawEffects = (ctx: CanvasRenderingContext2D) => {
    // Draw bullet trails, explosions, etc.
    // This would be enhanced with particle effects in a full implementation
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height);
    
    switch (gameState.currentRoom) {
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
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Add grid pattern for retro feel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    
    for (let x = 0; x <= canvasSize.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvasSize.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
    }
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, p: Player) => {
    const size = 8;
    const x = p.position.x;
    const y = p.position.y;

    // Player glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';

    // Player body
    ctx.fillStyle = p.id === player.id ? '#00ffff' : '#ffffff';
    ctx.fillRect(x - size/2, y - size/2, size, size);

    // Player outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - size/2, y - size/2, size, size);

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw health bar for other players
    if (p.id !== player.id) {
      const barWidth = 20;
      const barHeight = 3;
      const healthPercent = p.health / 100;
      
      ctx.fillStyle = '#333333';
      ctx.fillRect(x - barWidth/2, y - 15, barWidth, barHeight);
      
      ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
      ctx.fillRect(x - barWidth/2, y - 15, barWidth * healthPercent, barHeight);
    }
  };

  const drawMonster = (ctx: CanvasRenderingContext2D, monster: ActiveMonster) => {
    const size = monster.size * 8;
    const x = monster.position.x;
    const y = monster.position.y;

    // Monster color based on tier
    let color = '#666666';
    let glowColor = '#888888';
    
    switch (monster.tier) {
      case 1:
        color = '#666666';
        glowColor = '#888888';
        break;
      case 2:
        color = '#ffaa00';
        glowColor = '#ffcc00';
        break;
      case 3:
        color = '#ff6600';
        glowColor = '#ff8800';
        break;
      case 4:
        color = '#ff0000';
        glowColor = '#ff3333';
        break;
      case 5:
        color = '#aa00ff';
        glowColor = '#cc00ff';
        break;
    }

    // Boss effects
    if (monster.isBoss) {
      // Pulsing rainbow effect
      const time = Date.now() * 0.005;
      const hue = (time * 100) % 360;
      glowColor = `hsl(${hue}, 100%, 50%)`;
    }

    // Monster glow
    ctx.shadowBlur = monster.tier >= 3 ? 20 : 10;
    ctx.shadowColor = glowColor;

    // Monster body
    ctx.fillStyle = color;
    ctx.fillRect(x - size/2, y - size/2, size, size);

    // Monster outline
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = monster.tier >= 4 ? 3 : 2;
    ctx.strokeRect(x - size/2, y - size/2, size, size);

    // Reset shadow
    ctx.shadowBlur = 0;

    // Health bar
    if (monster.tier >= 3 || monster.isBoss) {
      const barWidth = Math.max(30, size * 1.5);
      const barHeight = monster.isBoss ? 6 : 4;
      const healthPercent = monster.health / monster.maxHealth;
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(x - barWidth/2, y - size/2 - 10, barWidth, barHeight);
      
      ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
      ctx.fillRect(x - barWidth/2, y - size/2 - 10, barWidth * healthPercent, barHeight);

      // Boss phase indicator
      if (monster.isBoss && monster.bossPhase && monster.maxBossPhases) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`P${monster.bossPhase}/${monster.maxBossPhases}`, x, y - size/2 - 15);
      }
    }

    // Special effects
    if (monster.effects.stunned) {
      // Stun stars
      ctx.fillStyle = '#ffff00';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('★', x, y - size);
    }

    if (monster.effects.regenerating) {
      // Regeneration particles
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawEffects = (ctx: CanvasRenderingContext2D) => {
    // Draw bullet trails, explosions, etc.
    // This would be enhanced with particle effects in a full implementation
  };

  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height);
    
    switch (gameState.currentRoom) {
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
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Add grid pattern for retro feel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    
    for (let x = 0; x <= canvasSize.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvasSize.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
    }
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, p: Player) => {
    const size = 8;
    const x = p.position.x;
    const y = p.position.y;

    // Player glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ffff';

    // Player body
    ctx.fillStyle = p.id === player.id ? '#00ffff' : '#ffffff';
    ctx.fillRect(x - size/2, y - size/2, size, size);

    // Player outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - size/2, y - size/2, size, size);

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw health bar for other players
    if (p.id !== player.id) {
      const barWidth = 20;
      const barHeight = 3;
      const healthPercent = p.health / 100;
      
      ctx.fillStyle = '#333333';
      ctx.fillRect(x - barWidth/2, y - 15, barWidth, barHeight);
      
      ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
      ctx.fillRect(x - barWidth/2, y - 15, barWidth * healthPercent, barHeight);
    }
  };

  const drawMonster = (ctx: CanvasRenderingContext2D, monster: ActiveMonster) => {
    const size = monster.size * 8;
    const x = monster.position.x;
    const y = monster.position.y;

    // Monster color based on tier
    let color = '#666666';
    let glowColor = '#888888';
    
    switch (monster.tier) {
      case 1:
        color = '#666666';
        glowColor = '#888888';
        break;
      case 2:
        color = '#ffaa00';
        glowColor = '#ffcc00';
        break;
      case 3:
        color = '#ff6600';
        glowColor = '#ff8800';
        break;
      case 4:
        color = '#ff0000';
        glowColor = '#ff3333';
        break;
      case 5:
        color = '#aa00ff';
        glowColor = '#cc00ff';
        break;
    }

    // Boss effects
    if (monster.isBoss) {
      // Pulsing rainbow effect
      const time = Date.now() * 0.005;
      const hue = (time * 100) % 360;
      glowColor = `hsl(${hue}, 100%, 50%)`;
    }

    // Monster glow
    ctx.shadowBlur = monster.tier >= 3 ? 20 : 10;
    ctx.shadowColor = glowColor;

    // Monster body
    ctx.fillStyle = color;
    ctx.fillRect(x - size/2, y - size/2, size, size);

    // Monster outline
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = monster.tier >= 4 ? 3 : 2;
    ctx.strokeRect(x - size/2, y - size/2, size, size);

    // Reset shadow
    ctx.shadowBlur = 0;

    // Health bar
    if (monster.tier >= 3 || monster.isBoss) {
      const barWidth = Math.max(30, size * 1.5);
      const barHeight = monster.isBoss ? 6 : 4;
      const healthPercent = monster.health / monster.maxHealth;
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(x - barWidth/2, y - size/2 - 10, barWidth, barHeight);
      
      ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
      ctx.fillRect(x - barWidth/2, y - size/2 - 10, barWidth * healthPercent, barHeight);

      // Boss phase indicator
      if (monster.isBoss && monster.bossPhase && monster.maxBossPhases) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`P${monster.bossPhase}/${monster.maxBossPhases}`, x, y - size/2 - 15);
      }
    }

    // Special effects
    if (monster.effects.stunned) {
      // Stun stars
      ctx.fillStyle = '#ffff00';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('★', x, y - size);
    }

    if (monster.effects.regenerating) {
      // Regeneration particles
      ctx.fillStyle = '#00ff00';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const renderGame = useCallback((ctx: CanvasRenderingContext2D) => {
    // Draw background based on current room
    drawBackground(ctx);

    // Draw players
    gameState.players.forEach(p => {
      if (p.status === 'alive') {
        drawPlayer(ctx, p);
      }
    });

    // Draw monsters
    gameState.monsters.forEach(monster => {
      drawMonster(ctx, monster);
    });

    // Draw effects
    drawEffects(ctx);
  }, [gameState, canvasSize]);

  const updatePlayerMovement = useCallback((deltaTime: number) => {
    if (player.status !== 'alive') return;

    let velocityX = 0;
    let velocityY = 0;
    const speed = isMobile ? 2 : 3; // Slower on mobile

    // Keyboard input
    if (keysRef.current.has('w') || keysRef.current.has('arrowup')) velocityY -= speed;
    if (keysRef.current.has('s') || keysRef.current.has('arrowdown')) velocityY += speed;
    if (keysRef.current.has('a') || keysRef.current.has('arrowleft')) velocityX -= speed;
    if (keysRef.current.has('d') || keysRef.current.has('arrowright')) velocityX += speed;

    // Touch input
    if (touchControlsRef.current.left.active) {
      const left = touchControlsRef.current.left;
      const deltaX = left.currentX - left.startX;
      const deltaY = left.currentY - left.startY;
      const deadZone = 10;

      if (Math.abs(deltaX) > deadZone) {
        velocityX = (deltaX / 100) * speed;
      }
      if (Math.abs(deltaY) > deadZone) {
        velocityY = (deltaY / 100) * speed;
      }
    }

    // Handle reload
    if (keysRef.current.has('r')) {
      onReload();
      keysRef.current.delete('r');
    }

    // Update position
    if (velocityX !== 0 || velocityY !== 0) {
      const newX = Math.max(20, Math.min(canvasSize.width - 20, player.position.x + velocityX));
      const newY = Math.max(20, Math.min(canvasSize.height - 20, player.position.y + velocityY));
      
      if (newX !== player.position.x || newY !== player.position.y) {
        onPlayerMove({ x: newX, y: newY });
      }
    }
  }, [player, canvasSize, onPlayerMove, onReload, isMobile]);

  // Game update loop
  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = Date.now();
    const _deltaTime = 16; // 60 FPS

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player movement
    updatePlayerMovement(_deltaTime);

    // Render game
    renderGame(ctx);

    animationRef.current = requestAnimationFrame(updateGame);
  }, [updatePlayerMovement, renderGame]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border border-gray-600 bg-black"
        style={{ 
          maxWidth: '100%',
          height: 'auto',
          imageRendering: 'pixelated'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Mobile Controls Overlay */}
      {isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Left side - Movement joystick area */}
          <div className="absolute left-0 top-0 w-1/2 h-full pointer-events-auto">
            <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-cyan-400 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
              <div className="w-8 h-8 bg-cyan-400 rounded-full"></div>
            </div>
          </div>

          {/* Right side - Attack button */}
          <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-auto">
            <div className="absolute bottom-4 right-4 w-16 h-16 border-2 border-red-400 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
              <div className="w-8 h-8 bg-red-400 rounded-full"></div>
            </div>
          </div>

          {/* Reload button */}
          <div className="absolute top-4 right-4 w-12 h-12 border-2 border-yellow-400 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-yellow-400 text-xs font-mono">R</div>
          </div>
        </div>
      )}
    </div>
  );
}