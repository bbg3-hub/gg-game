'use client';

import React from 'react';

interface SansCharacterProps {
  expression?: 'normal' | 'wink' | 'serious';
}

const SPRITE_SHEET = '/sans-spritesheet.png';

export default function SansCharacter({ expression = 'normal' }: SansCharacterProps) {
  const getHeadPosition = () => {
    switch (expression) {
      case 'wink': return { x: -32, y: 0 };
      case 'serious': return { x: -64, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };

  const headPos = getHeadPosition();

  return (
    <div className="flex flex-col items-center select-none scale-2">
      <style jsx>{`
        .pixelated {
          image-rendering: pixelated;
          background-image: url(${SPRITE_SHEET});
          background-repeat: no-repeat;
        }
        
        @keyframes bobbing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }

        .bob-animation {
          animation: bobbing 2s ease-in-out infinite;
        }

        .head-bob {
          animation: bobbing 2s ease-in-out infinite;
          animation-delay: 0.1s;
        }
      `}</style>

      {/* Head */}
      <div 
        className="pixelated head-bob"
        style={{
          width: '32px',
          height: '32px',
          backgroundPosition: `${headPos.x}px ${headPos.y}px`,
          backgroundSize: '256px 256px',
          marginBottom: '-4px',
          zIndex: 2,
          position: 'relative'
        }}
      />

      {/* Torso */}
      <div 
        className="pixelated bob-animation"
        style={{
          width: '54px',
          height: '42px',
          backgroundPosition: '0px -32px',
          backgroundSize: '256px 256px',
          marginBottom: '-2px',
          zIndex: 1
        }}
      />

      {/* Legs */}
      <div 
        className="pixelated"
        style={{
          width: '54px',
          height: '22px',
          backgroundPosition: '0px -74px',
          backgroundSize: '256px 256px',
          zIndex: 0
        }}
      />
    </div>
  );
}
