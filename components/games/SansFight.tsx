'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

type Phase = 'menu' | 'dialogue' | 'attack' | 'result';

interface SansFightProps {
  onBack?: () => void;
}

interface Bone {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const HeartIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function SansFight({ onBack }: SansFightProps) {
  const [phase, setPhase] = useState<Phase>('dialogue');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [playerHP, setPlayerHP] = useState(92);
  const maxHP = 92;

  // Attack phase states (visual)
  const [vHeartPos, setVHeartPos] = useState({ x: 50, y: 50 });
  const [vBones, setVBones] = useState<Bone[]>([]);
  
  // Game state refs (for the loop)
  const heartPos = useRef({ x: 50, y: 50 });
  const bones = useRef<Bone[]>([]);
  const lastBoneTime = useRef(0);
  const nextBoneId = useRef(0);
  const attackStartTime = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const lastCollisionTime = useRef(0);

  const dialogues = useMemo(() => [
    "it's a beautiful day outside.",
    "birds are singing, flowers are blooming...",
    "on days like these, kids like you...",
    "S h o u l d  b e  b u r n i n g  i n  h e l l.",
    "anyway, let's get to it.",
  ], []);

  const menuOptions = useMemo(() => ['FIGHT', 'ACT', 'ITEM', 'MERCY'], []);

  const typeText = useCallback((fullText: string) => {
    setIsTyping(true);
    setText('');
    let i = 0;
    const interval = setInterval(() => {
      setText((prev) => prev + fullText[i]);
      i++;
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === 'dialogue') {
      const cleanup = typeText(dialogues[dialogueIndex]);
      return cleanup;
    }
  }, [phase, dialogueIndex, typeText, dialogues]);

  // Movement handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.key);
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game Loop
  useEffect(() => {
    if (phase !== 'attack') return;

    attackStartTime.current = Date.now();
    heartPos.current = { x: 50, y: 50 };
    bones.current = [];
    let frameId: number;

    const update = () => {
      const now = Date.now();
      const elapsed = now - attackStartTime.current;

      // End attack after 8 seconds
      if (elapsed > 8000) {
        setPhase('dialogue');
        setDialogueIndex(4);
        return;
      }

      // Move heart
      const speed = 0.8;
      if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w')) heartPos.current.y -= speed;
      if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('s')) heartPos.current.y += speed;
      if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) heartPos.current.x -= speed;
      if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) heartPos.current.x += speed;

      // Bounds
      heartPos.current.x = Math.max(2, Math.min(98, heartPos.current.x));
      heartPos.current.y = Math.max(5, Math.min(95, heartPos.current.y));

      // Spawn bones
      if (now - lastBoneTime.current > 800) {
        const height = 25 + Math.random() * 35;
        const isTop = Math.random() > 0.5;
        const newBone: Bone = {
          id: nextBoneId.current++,
          x: 100,
          y: isTop ? 0 : 100 - height,
          width: 6,
          height: height
        };
        bones.current.push(newBone);
        lastBoneTime.current = now;
      }

      // Move bones
      bones.current = bones.current
        .map(b => ({ ...b, x: b.x - 1.2 }))
        .filter(b => b.x > -10);

      // Collision detection (if not recently hit)
      if (now - lastCollisionTime.current > 200) {
        let hit = false;
        for (const b of bones.current) {
          const hSizeX = 4;
          const hSizeY = 8;
          if (
            heartPos.current.x + hSizeX/2 > b.x &&
            heartPos.current.x - hSizeX/2 < b.x + b.width &&
            heartPos.current.y + hSizeY/2 > b.y &&
            heartPos.current.y - hSizeY/2 < b.y + b.height
          ) {
            hit = true;
            break;
          }
        }
        if (hit) {
          setPlayerHP(hp => Math.max(0, hp - 5));
          lastCollisionTime.current = now;
        }
      }

      // Sync state for rendering
      setVHeartPos({ ...heartPos.current });
      setVBones([...bones.current]);

      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [phase]);

  useEffect(() => {
    if (playerHP <= 0 && phase !== 'result') {
      setPhase('result');
    }
  }, [playerHP, phase]);

  const handleNextDialogue = () => {
    if (isTyping) {
      setText(dialogues[dialogueIndex]);
      setIsTyping(false);
      return;
    }

    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      setPhase('menu');
    }
  };

  const handleMenuSelect = (index: number) => {
    setSelectedMenu(index);
    setPhase('attack');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono p-4 select-none overflow-hidden">
      {/* Sans Sprite Area */}
      <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-300 ${phase === 'attack' ? 'scale-110' : 'animate-bounce [animation-duration:3s]'}`}>
          {/* Sans Head */}
          <g>
            <path
              d="M30 40 Q30 20 50 20 Q70 20 70 40 Q70 55 50 55 Q30 55 30 40"
              fill="white"
              stroke="white"
              strokeWidth="2"
            />
            {/* Eyes */}
            <rect x="38" y="35" width="6" height="8" fill="black" />
            <rect x="56" y="35" width="6" height="8" fill="black" />
            {/* Glowing Eye during attack */}
            {phase === 'attack' && (
              <circle cx="41" cy="39" r="3" fill="#00ffff" className="animate-pulse shadow-[0_0_10px_#00ffff]" />
            )}
            {/* Mouth */}
            <path d="M38 46 Q50 52 62 46" stroke="black" strokeWidth="1" fill="none" />
            <path d="M40 46 L40 50 M44 47 L44 51 M48 48 L48 52 M52 48 L52 52 M56 47 L56 51 M60 46 L60 50" stroke="black" strokeWidth="0.5" />
          </g>
          
          {/* Sans Body */}
          <path
            d="M35 55 L25 80 L75 80 L65 55 Z"
            fill="white"
            stroke="white"
            strokeWidth="2"
          />
          {/* Jacket details */}
          <path d="M42 55 L38 80 M58 55 L62 80" stroke="black" strokeWidth="2" />
          {/* Shorts */}
          <rect x="30" y="80" width="40" height="10" fill="white" />
          <rect x="45" y="80" width="10" height="10" fill="black" />
        </svg>
      </div>

      {/* Main Battle Box */}
      <div 
        className={`w-full max-w-2xl border-4 border-white aspect-[2/1] relative p-6 mb-8 flex items-start justify-start overflow-hidden bg-black ${dialogueIndex === 3 ? 'animate-pulse text-red-500 border-red-500' : ''}`}
        onClick={phase === 'dialogue' ? handleNextDialogue : undefined}
      >
        {phase === 'dialogue' && (
          <div className="text-2xl leading-relaxed cursor-pointer w-full h-full">
            * {text}
            {!isTyping && (
              <span className="inline-block w-3 h-3 bg-white ml-2 animate-pulse" />
            )}
          </div>
        )}

        {phase === 'menu' && (
          <div className="grid grid-cols-2 gap-4 w-full text-2xl">
            <div className="col-span-2 flex items-center">
               <HeartIcon className="text-red-500 w-6 h-6 mr-4" />
               <span>What will you do?</span>
            </div>
          </div>
        )}

        {phase === 'attack' && (
          <div className="w-full h-full relative">
            {/* Player Heart */}
            <HeartIcon 
              className="text-red-500 w-6 h-6 absolute" 
              style={{ 
                left: `${vHeartPos.x}%`, 
                top: `${vHeartPos.y}%`,
                transform: 'translate(-50%, -50%)'
              }} 
            />

            {/* Bones */}
            {vBones.map(bone => (
              <div 
                key={bone.id}
                className="absolute bg-white border border-gray-400 rounded-sm"
                style={{
                  left: `${bone.x}%`,
                  top: `${bone.y}%`,
                  width: `${bone.width}%`,
                  height: `${bone.height}%`
                }}
              />
            ))}
          </div>
        )}

        {phase === 'result' && (
          <div className="w-full h-full flex flex-col items-center justify-center text-red-500 text-4xl font-bold animate-pulse">
            GAME OVER
            <button 
              onClick={() => {
                setPlayerHP(92);
                setPhase('dialogue');
                setDialogueIndex(0);
              }}
              className="mt-8 text-xl text-white border-2 border-white px-6 py-2 hover:bg-white hover:text-black transition-all"
            >
              RETRY
            </button>
          </div>
        )}
      </div>

      {/* Player Stats */}
      <div className="w-full max-w-2xl flex items-center justify-start gap-8 mb-8 text-xl font-bold">
        <span>CHARA</span>
        <span>LV 19</span>
        <div className="flex items-center gap-2">
          <span>HP</span>
          <div className="w-48 h-6 bg-red-600 relative">
            <div 
              className={`h-full bg-yellow-400 transition-all duration-100 ${playerHP < 20 ? 'animate-pulse' : ''}`} 
              style={{ width: `${(playerHP / maxHP) * 100}%` }}
            />
          </div>
          <span>{playerHP} / {maxHP}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`w-full max-w-2xl grid grid-cols-4 gap-4 transition-opacity duration-300 ${phase === 'attack' || phase === 'result' ? 'opacity-30 pointer-events-none' : ''}`}>
        {menuOptions.map((option, i) => (
          <button
            key={option}
            onClick={() => handleMenuSelect(i)}
            onMouseEnter={() => setSelectedMenu(i)}
            className={`
              border-2 py-2 text-xl font-bold transition-all
              ${selectedMenu === i 
                ? 'border-yellow-400 text-yellow-400 bg-black scale-105' 
                : 'border-orange-500 text-orange-500 bg-black hover:border-orange-300'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              {selectedMenu === i && <HeartIcon className="w-4 h-4 text-red-500" />}
              {option}
            </div>
          </button>
        ))}
      </div>

      {onBack && (
        <button 
          onClick={onBack}
          className="mt-12 text-gray-500 hover:text-white transition-colors"
        >
          [ ESCAPE TO MENU ]
        </button>
      )}
    </div>
  );
}
