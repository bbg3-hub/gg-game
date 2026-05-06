'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

type Phase = 'menu' | 'dialogue' | 'attack' | 'result';

interface SansFightProps {
  onBack?: () => void;
}

const HeartIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
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
    if (menuOptions[index] === 'FIGHT') {
       setPhase('dialogue');
       setDialogueIndex(4);
       // Simulate taking damage for the sake of using setPlayerHP
       setPlayerHP(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono p-4 select-none">
      {/* Sans Sprite Area */}
      <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-bounce [animation-duration:3s]">
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
        className={`w-full max-w-2xl border-4 border-white aspect-[2/1] relative p-6 mb-8 flex items-start justify-start ${dialogueIndex === 3 ? 'animate-pulse text-red-500 border-red-500' : ''}`}
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
      </div>

      {/* Player Stats */}
      <div className="w-full max-w-2xl flex items-center justify-start gap-8 mb-8 text-xl font-bold">
        <span>CHARA</span>
        <span>LV 19</span>
        <div className="flex items-center gap-2">
          <span>HP</span>
          <div className="w-48 h-6 bg-red-600 relative">
            <div 
              className="h-full bg-yellow-400" 
              style={{ width: `${(playerHP / maxHP) * 100}%` }}
            />
          </div>
          <span>{playerHP} / {maxHP}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-2xl grid grid-cols-4 gap-4">
        {menuOptions.map((option, i) => (
          <button
            key={option}
            onClick={() => handleMenuSelect(i)}
            onMouseEnter={() => setSelectedMenu(i)}
            className={`
              border-2 py-2 text-xl font-bold transition-colors
              ${selectedMenu === i 
                ? 'border-yellow-400 text-yellow-400 bg-black' 
                : 'border-orange-500 text-orange-500 bg-black'
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
