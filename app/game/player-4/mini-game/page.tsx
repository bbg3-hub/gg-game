'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loadGameState, updatePlayerProgress } from '@/lib/gameLogic';

interface Enemy {
  x: number;
  y: number;
  speed: number;
  id: number;
}

export default function MiniGamePage() {
  const router = useRouter();
  const playerId = 'player-4';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  const playerRef = useRef({ x: 300, y: 500 });
  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<{ x: number; y: number; speed: number }[]>([]);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const enemyIdRef = useRef(0);

  useEffect(() => {
    const gameState = loadGameState();
    if (!gameState) {
      router.push('/game/setup');
      return;
    }

    const player = gameState.players.find((p) => p.id === playerId);
    if (player?.miniGameCompleted) {
      router.push('/game');
      return;
    }
  }, [router]);

  const handleGameEnd = useCallback(() => {
    setGameOver(true);
    const finalScore = Math.min(score, 100);
    const gameState = loadGameState();
    if (gameState) {
      updatePlayerProgress(gameState, playerId, 'miniGame', finalScore);
    }
    setMessage(`DRONES NEUTRALIZED! [+${finalScore} pts]`);
    setTimeout(() => router.push('/game'), 3000);
  }, [score, router]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, handleGameEnd]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const spawnEnemy = () => {
      enemiesRef.current.push({
        x: Math.random() * (canvas.width - 30),
        y: -30,
        speed: 2 + Math.random() * 2,
        id: enemyIdRef.current++,
      });
    };

    const spawnInterval = setInterval(spawnEnemy, 1000);

    const gameLoop = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ffff';
      ctx.fillRect(playerRef.current.x, playerRef.current.y, 30, 30);

      bulletsRef.current = bulletsRef.current.filter((bullet) => {
        bullet.y -= bullet.speed;
        
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(bullet.x, bullet.y, 5, 15);
        
        return bullet.y > 0;
      });

      enemiesRef.current = enemiesRef.current.filter((enemy) => {
        enemy.y += enemy.speed;
        
        const hitByBullet = bulletsRef.current.some((bullet) => {
          if (
            bullet.x < enemy.x + 30 &&
            bullet.x + 5 > enemy.x &&
            bullet.y < enemy.y + 30 &&
            bullet.y + 15 > enemy.y
          ) {
            bulletsRef.current = bulletsRef.current.filter((b) => b !== bullet);
            setScore((prev) => prev + 10);
            return true;
          }
          return false;
        });

        if (hitByBullet) return false;

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(enemy.x, enemy.y, 30, 30);

        if (enemy.y > canvas.height) {
          return false;
        }

        return true;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      clearInterval(spawnInterval);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (e.key === 'ArrowLeft') {
      playerRef.current.x = Math.max(0, playerRef.current.x - 20);
    } else if (e.key === 'ArrowRight') {
      playerRef.current.x = Math.min(canvas.width - 30, playerRef.current.x + 20);
    } else if (e.key === ' ') {
      e.preventDefault();
      bulletsRef.current.push({
        x: playerRef.current.x + 12,
        y: playerRef.current.y,
        speed: 10,
      });
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    enemiesRef.current = [];
    bulletsRef.current = [];
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="border-2 border-cyan-400 p-6 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold">DRONE NEUTRALIZATION</div>
            <div className="text-sm opacity-70">[PLAYER 4 - DEFENSE STATION]</div>
          </div>
        </div>

        {!gameStarted && !gameOver && (
          <div className="border border-cyan-400 p-6 space-y-4">
            <div className="text-center space-y-4">
              <div className="text-lg">INSTRUCTIONS:</div>
              <ul className="text-sm space-y-2 text-left max-w-md mx-auto">
                <li>→ Use ARROW KEYS to move left/right</li>
                <li>→ Press SPACEBAR to shoot</li>
                <li>→ Destroy as many drones as possible</li>
                <li>→ 30 seconds time limit</li>
                <li>→ Each drone = 10 points</li>
              </ul>
              <button
                onClick={startGame}
                className="border-2 border-cyan-400 px-12 py-4 text-xl font-bold hover:bg-cyan-400 hover:text-black transition-all mt-6"
              >
                START MISSION
              </button>
            </div>
          </div>
        )}

        {gameStarted && !gameOver && (
          <>
            <div className="flex justify-between text-xl font-bold">
              <div>SCORE: {score}</div>
              <div className={timeLeft < 10 ? 'text-red-500 animate-pulse' : ''}>
                TIME: {timeLeft}s
              </div>
            </div>

            <div className="border-2 border-cyan-400 flex justify-center">
              <canvas
                ref={canvasRef}
                width={600}
                height={600}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className="focus:outline-none"
              />
            </div>

            <div className="text-center text-sm">
              USE ARROW KEYS + SPACEBAR | CLICK CANVAS TO FOCUS
            </div>
          </>
        )}

        {gameOver && message && (
          <div className="border border-cyan-400 p-8 text-center space-y-4">
            <div className="text-2xl font-bold text-green-400">{message}</div>
            <div className="text-sm">Returning to mission control...</div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => router.push('/game')}
            className="border border-cyan-400 px-6 py-2 text-sm hover:bg-cyan-400 hover:text-black transition-all"
          >
            ← RETURN TO BASE
          </button>
        </div>
      </div>
    </div>
  );
}
