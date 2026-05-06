'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import SansCharacter from './SansCharacter';

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

const SPRITE_SHEET = '/sans-spritesheet.png';

const HeartIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div 
    className={`pixelated ${className}`}
    style={{
      width: '16px',
      height: '16px',
      backgroundImage: `url(${SPRITE_SHEET})`,
      backgroundPosition: '-220px 0px', // Assuming heart is at this position
      backgroundSize: '256px 256px',
      imageRendering: 'pixelated',
      ...style
    }}
  />
);

const SansButton = ({ 
  type, 
  active, 
  onClick, 
  onMouseEnter 
}: { 
  type: 'FIGHT' | 'ACT' | 'ITEM' | 'MERCY'; 
  active: boolean; 
  onClick: () => void;
  onMouseEnter: () => void;
}) => {
  const getPosition = () => {
    const yOffsets = { FIGHT: 96, ACT: 138, ITEM: 180, MERCY: 222 };
    const x = active ? -110 : 0;
    return { x, y: -yOffsets[type] };
  };

  const pos = getPosition();

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className="focus:outline-none"
    >
      <div 
        style={{
          width: '110px',
          height: '42px',
          backgroundImage: `url(${SPRITE_SHEET})`,
          backgroundPosition: `${pos.x}px ${pos.y}px`,
          backgroundSize: '256px 256px',
          imageRendering: 'pixelated',
        }}
      />
    </button>
  );
};

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

  const menuOptions: ('FIGHT' | 'ACT' | 'ITEM' | 'MERCY')[] = ['FIGHT', 'ACT', 'ITEM', 'MERCY'];

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
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      if (phase === 'menu') {
        if (e.key === 'ArrowLeft') setSelectedMenu(m => (m > 0 ? m - 1 : 3));
        if (e.key === 'ArrowRight') setSelectedMenu(m => (m < 3 ? m + 1 : 0));
        if (e.key === 'Enter' || e.key === 'z') handleMenuSelect(selectedMenu);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [phase, selectedMenu]);

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
      <style jsx>{`
        .pixelated {
          image-rendering: pixelated;
        }
        .determination-font {
          font-family: 'Determination Mono', 'Courier New', Courier, monospace;
        }
        .hp-bar-bg {
          background-color: #f00;
          width: 48px;
          height: 21px;
        }
        .hp-bar-fill {
          background-color: #ff0;
          height: 100%;
        }
      `}</style>

      {/* Sans Character */}
      <div className="mb-12">
        <SansCharacter 
          expression={dialogueIndex === 3 ? 'serious' : 'normal'} 
        />
      </div>

      {/* Main Battle Box */}
      <div 
        className={`w-full max-w-2xl border-4 border-white aspect-[2.5/1] relative p-6 mb-4 flex items-start justify-start overflow-hidden bg-black ${dialogueIndex === 3 ? 'text-red-500 border-red-500' : ''}`}
        onClick={phase === 'dialogue' ? handleNextDialogue : undefined}
      >
        {phase === 'dialogue' && (
          <div className="text-3xl leading-relaxed cursor-pointer w-full h-full determination-font">
            * {text}
            {!isTyping && (
              <span className="inline-block w-4 h-4 bg-white ml-2 animate-pulse" />
            )}
          </div>
        )}

        {phase === 'menu' && (
          <div className="text-3xl determination-font w-full h-full flex flex-col pt-2">
             <div className="flex items-center">
                <HeartIcon className="mr-6" />
                <span>* What will you do?</span>
             </div>
          </div>
        )}

        {phase === 'attack' && (
          <div className="w-full h-full relative">
            {/* Player Heart */}
            <HeartIcon 
              className="absolute" 
              style={{ 
                left: `${vHeartPos.x}%`, 
                top: `${vHeartPos.y}%`,
                transform: 'translate(-50%, -50%) scale(1.5)'
              }} 
            />

            {/* Bones */}
            {vBones.map(bone => (
              <div 
                key={bone.id}
                className="absolute bg-white"
                style={{
                  left: `${bone.x}%`,
                  top: `${bone.y}%`,
                  width: `${bone.width}%`,
                  height: `${bone.height}%`,
                  border: '1px solid black'
                }}
              />
            ))}
          </div>
        )}

        {phase === 'result' && (
          <div className="w-full h-full flex flex-col items-center justify-center text-red-500 text-5xl font-bold determination-font">
            GAME OVER
            <button 
              onClick={() => {
                setPlayerHP(92);
                setPhase('dialogue');
                setDialogueIndex(0);
              }}
              className="mt-8 text-2xl text-white border-4 border-white px-8 py-3 hover:bg-white hover:text-black transition-all"
            >
              RETRY
            </button>
          </div>
        )}
      </div>

      {/* Player Stats Bar */}
      <div className="w-full max-w-2xl flex items-center justify-start gap-4 mb-4 text-2xl determination-font font-bold">
        <span className="mr-4">UT</span>
        <span className="mr-8">LV 19</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold mr-1">HP</span>
          <div className="hp-bar-bg">
            <div 
              className="hp-bar-fill transition-all duration-100" 
              style={{ width: `${(playerHP / maxHP) * 100}%` }}
            />
          </div>
          <span className="ml-2">{playerHP} / {maxHP}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`w-full max-w-2xl grid grid-cols-4 gap-2 transition-opacity duration-300 ${phase === 'attack' || phase === 'result' ? 'opacity-30 pointer-events-none' : ''}`}>
        {menuOptions.map((option, i) => (
          <SansButton
            key={option}
            type={option}
            active={selectedMenu === i && phase === 'menu'}
            onClick={() => handleMenuSelect(i)}
            onMouseEnter={() => setSelectedMenu(i)}
          />
        ))}
      </div>

      {onBack && (
        <button 
          onClick={onBack}
          className="mt-8 text-gray-500 hover:text-white transition-colors text-sm"
        >
          [ ESCAPE TO MENU ]
        </button>
      )}
    </div>
  );
}
