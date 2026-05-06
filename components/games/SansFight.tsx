'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import SansCharacter from './SansCharacter';

const VIRTUAL_WIDTH = 640;
const VIRTUAL_HEIGHT = 480;
const SPRITE_SHEET = '/sans-spritesheet.png';

type Phase = 'menu' | 'dialogue' | 'attack' | 'result';

interface Bone {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

const HeartIcon = ({ x, y, size = 16, className, style }: { x?: number; y?: number; size?: number; className?: string; style?: React.CSSProperties }) => (
  <div 
    className={`pixelated ${className}`}
    style={{
      position: 'absolute',
      left: x !== undefined ? `${x}px` : undefined,
      top: y !== undefined ? `${y}px` : undefined,
      width: `${size}px`,
      height: `${size}px`,
      backgroundImage: `url(${SPRITE_SHEET})`,
      backgroundPosition: '-220px 0px',
      backgroundSize: '256px 256px',
      imageRendering: 'pixelated',
      zIndex: 50,
      ...style
    }}
  />
);

const SansButton = ({ 
  type, 
  active, 
  x, 
  y 
}: { 
  type: 'FIGHT' | 'ACT' | 'ITEM' | 'MERCY'; 
  active: boolean;
  x: number;
  y: number;
}) => {
  const getSpriteY = () => {
    switch (type) {
      case 'FIGHT': return 96;
      case 'ACT': return 138;
      case 'ITEM': return 180;
      case 'MERCY': return 222;
    }
  };

  const spriteX = active ? -110 : 0;
  const spriteY = -getSpriteY();

  return (
    <div 
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: '110px',
        height: '42px',
        backgroundImage: `url(${SPRITE_SHEET})`,
        backgroundPosition: `${spriteX}px ${spriteY}px`,
        backgroundSize: '256px 256px',
        imageRendering: 'pixelated',
      }}
    >
      {active && <HeartIcon x={8} y={13} />}
    </div>
  );
};

export default function SansFight({ onBack }: { onBack?: () => void }) {
  const [phase, setPhase] = useState<Phase>('dialogue');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [playerHP, setPlayerHP] = useState(92);
  const [scale, setScale] = useState(1);
  
  const maxHP = 92;

  // Attack phase states
  const [vHeartPos, setVHeartPos] = useState({ x: 320, y: 320 });
  const [vBones, setVBones] = useState<Bone[]>([]);
  
  const heartPos = useRef({ x: 320, y: 320 });
  const bones = useRef<Bone[]>([]);
  const lastBoneTime = useRef(0);
  const nextBoneId = useRef(0);
  const attackStartTime = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());

  const dialogues = useMemo(() => [
    "it's a beautiful day outside.",
    "birds are singing, flowers are blooming...",
    "on days like these, kids like you...",
    "S h o u l d  b e  b u r n i n g  i n  h e l l.",
    "anyway, let's get to it.",
  ], []);

  const menuOptions: ('FIGHT' | 'ACT' | 'ITEM' | 'MERCY')[] = ['FIGHT', 'ACT', 'ITEM', 'MERCY'];
  const menuXPositions = [32, 185, 345, 500];

  // Scaling logic
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const sw = window.innerWidth / VIRTUAL_WIDTH;
        const sh = window.innerHeight / VIRTUAL_HEIGHT;
        setScale(Math.min(sw, sh));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const typeText = useCallback((fullText: string) => {
    setIsTyping(true);
    setText('');
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, i + 1));
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

  const handleNextDialogue = useCallback(() => {
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
  }, [isTyping, dialogues, dialogueIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.current.add(key);
      
      if (phase === 'menu') {
        if (key === 'arrowleft') setSelectedMenu(m => (m > 0 ? m - 1 : 3));
        if (key === 'arrowright') setSelectedMenu(m => (m < 3 ? m + 1 : 0));
        if (key === 'enter' || key === 'z') setPhase('attack');
      } else if (phase === 'dialogue') {
        if (key === 'enter' || key === 'z') {
          handleNextDialogue();
        }
      } else if (phase === 'result') {
        if (key === 'enter' || key === 'z') {
          setPlayerHP(92);
          setPhase('dialogue');
          setDialogueIndex(0);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [phase, selectedMenu, handleNextDialogue]);

  // Game Loop for Attack Phase
  useEffect(() => {
    if (phase !== 'attack') return;

    attackStartTime.current = Date.now();
    heartPos.current = { x: 320, y: 320 };
    bones.current = [];
    let frameId: number;

    const update = () => {
      const now = Date.now();
      const elapsed = now - attackStartTime.current;

      if (elapsed > 10000) {
        setPhase('menu');
        return;
      }

      // Movement
      const speed = 4;
      if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) heartPos.current.y -= speed;
      if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) heartPos.current.y += speed;
      if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) heartPos.current.x -= speed;
      if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) heartPos.current.x += speed;

      // Box constraints: x: 32, y: 250, w: 575, h: 140
      // Inner box (account for border and padding)
      const boxLeft = 32 + 5;
      const boxTop = 250 + 5;
      const boxRight = 32 + 575 - 5 - 16;
      const boxBottom = 250 + 140 - 5 - 16;
      
      heartPos.current.x = Math.max(boxLeft, Math.min(boxRight, heartPos.current.x));
      heartPos.current.y = Math.max(boxTop, Math.min(boxBottom, heartPos.current.y));

      // Bone spawning
      if (now - lastBoneTime.current > 400) {
        const height = 40 + Math.random() * 60;
        const isTop = Math.random() > 0.5;
        bones.current.push({
          id: nextBoneId.current++,
          x: 640,
          y: isTop ? 250 + 5 : 250 + 140 - height - 5,
          width: 10,
          height: height
        });
        lastBoneTime.current = now;
      }

      bones.current = bones.current
        .map(b => ({ ...b, x: b.x - 6 }))
        .filter(b => b.x + b.width > 0);

      // Collision
      let hit = false;
      for (const b of bones.current) {
        if (
          heartPos.current.x < b.x + b.width &&
          heartPos.current.x + 16 > b.x &&
          heartPos.current.y < b.y + b.height &&
          heartPos.current.y + 16 > b.y
        ) {
          hit = true;
          break;
        }
      }
      
      if (hit) {
        setPlayerHP(hp => Math.max(0, hp - 2));
      }

      setVHeartPos({ ...heartPos.current });
      setVBones([...bones.current]);
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [phase]);

  useEffect(() => {
    if (playerHP <= 0 && phase !== 'result') setPhase('result');
  }, [playerHP, phase]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black overflow-hidden font-mono">
      <style jsx>{`
        .pixelated {
          image-rendering: pixelated;
        }
        .determination-font {
          font-family: 'Determination Mono', monospace;
        }
        @keyframes heartPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-heart-pulse {
          animation: heartPulse 0.8s infinite;
        }
      `}</style>

      <div 
        style={{
          width: `${VIRTUAL_WIDTH}px`,
          height: `${VIRTUAL_HEIGHT}px`,
          position: 'relative',
          transform: `scale(${scale})`,
          backgroundColor: 'black',
        }}
      >
        {/* Sans Character */}
        <div style={{ position: 'absolute', left: '320px', top: '130px', transform: 'translateX(-50%) scale(2)' }}>
          <SansCharacter expression={dialogueIndex === 3 ? 'serious' : (phase === 'attack' ? 'wink' : 'normal')} />
        </div>

        {/* Battle Box */}
        <div 
          style={{
            position: 'absolute',
            left: '32px',
            top: '250px',
            width: '575px',
            height: '140px',
            border: '5px solid white',
            backgroundColor: 'black',
            boxSizing: 'border-box',
          }}
        >
          {phase === 'dialogue' && (
            <div className="determination-font text-white text-[32px] p-[20px] leading-[1.2] whitespace-pre-wrap select-none">
              * {text}
              {!isTyping && (
                <span className="inline-block w-[16px] h-[16px] bg-white ml-2 animate-heart-pulse" />
              )}
            </div>
          )}

          {phase === 'menu' && (
            <div className="determination-font text-white text-[32px] p-[20px] pl-[60px] leading-[1.2] select-none relative">
              <HeartIcon x={20} y={30} />
              * What will you do?
            </div>
          )}

          {phase === 'attack' && (
            <div className="w-full h-full relative overflow-hidden">
              <HeartIcon x={vHeartPos.x - 32} y={vHeartPos.y - 250} />
              {vBones.map(bone => (
                <div 
                  key={bone.id}
                  className="absolute bg-white"
                  style={{
                    left: `${bone.x - 32}px`,
                    top: `${bone.y - 250}px`,
                    width: `${bone.width}px`,
                    height: `${bone.height}px`,
                  }}
                />
              ))}
            </div>
          )}

          {phase === 'result' && (
            <div className="w-full h-full flex flex-col items-center justify-center text-red-500 determination-font bg-black z-50">
              <div className="text-[64px] font-bold">GAME OVER</div>
              <div className="mt-4 text-white text-[24px]">Stay determined...</div>
              <div 
                className="mt-8 text-white cursor-pointer hover:text-yellow-400 text-[32px] border-4 border-white px-6 py-2"
                onClick={() => { setPlayerHP(92); setPhase('dialogue'); setDialogueIndex(0); }}
              >
                RETRY
              </div>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div 
          className="determination-font text-white select-none"
          style={{
            position: 'absolute',
            left: '32px',
            top: '400px',
            width: '575px',
            display: 'flex',
            alignItems: 'baseline',
            fontWeight: 'bold',
          }}
        >
          <span className="text-[24px] mr-6">UT</span>
          <span className="text-[20px] mr-8">LV 19</span>
          <span className="text-[10px] mr-2 self-center">HP</span>
          <div style={{ width: '115px', height: '21px', backgroundColor: '#f00', position: 'relative', marginRight: '16px', alignSelf: 'center' }}>
            <div 
              style={{ 
                width: `${(playerHP / maxHP) * 115}px`, 
                height: '100%', 
                backgroundColor: '#ff0' 
              }} 
            />
          </div>
          <span className="text-[24px]">{playerHP} / {maxHP}</span>
        </div>

        {/* Action Buttons */}
        {menuOptions.map((option, i) => (
          <SansButton
            key={option}
            type={option}
            active={selectedMenu === i && phase === 'menu'}
            x={menuXPositions[i]}
            y={432}
          />
        ))}

        {onBack && (
          <div 
            onClick={onBack}
            className="absolute bottom-2 right-2 text-gray-700 hover:text-white cursor-pointer text-[12px] determination-font"
          >
            [ ESCAPE ]
          </div>
        )}
      </div>
    </div>
  );
}
