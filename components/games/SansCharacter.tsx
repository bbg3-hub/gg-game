'use client';

import React, { useEffect, useState } from 'react';

interface SansCharacterProps {
  expression?: 'normal' | 'wink' | 'serious';
}

const SPRITE_SHEET = '/sans-spritesheet.png';

export default function SansCharacter({ expression = 'normal' }: SansCharacterProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let animationId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      // Sans sways at about 1 cycle per 2 seconds (very roughly)
      // We use a sine wave for smooth swaying
      setFrame(elapsed);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const getHeadPosition = () => {
    switch (expression) {
      case 'wink': return { x: -32, y: 0 };
      case 'serious': return { x: -64, y: 0 };
      default: return { x: 0, y: 0 };
    }
  };

  const headPos = getHeadPosition();

  // Animation values
  const swayAmount = 2; // pixels
  const bobAmount = 1; // pixels
  const freq = 0.003; // speed

  const sway = Math.sin(frame * freq) * swayAmount;
  const bob = Math.cos(frame * freq * 2) * bobAmount;
  
  // Head lag - use a delayed frame or different phase
  const headSway = Math.sin((frame - 100) * freq) * swayAmount;
  const headBob = Math.cos((frame - 100) * freq * 2) * bobAmount;

  return (
    <div className="relative select-none" style={{ width: '100px', height: '120px' }}>
      <style jsx>{`
        .pixelated {
          image-rendering: pixelated;
          background-image: url(${SPRITE_SHEET});
          background-repeat: no-repeat;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      `}</style>

      {/* Legs - Static */}
      <div 
        className="pixelated"
        style={{
          width: '54px',
          height: '22px',
          backgroundPosition: '0px -74px',
          backgroundSize: '256px 256px',
          bottom: '10px',
          zIndex: 0
        }}
      />

      {/* Torso - Sways and Bobs */}
      <div 
        className="pixelated"
        style={{
          width: '54px',
          height: '42px',
          backgroundPosition: '0px -32px',
          backgroundSize: '256px 256px',
          bottom: '30px',
          transform: `translateX(calc(-50% + ${sway}px)) translateY(${bob}px)`,
          zIndex: 1
        }}
      />

      {/* Head - Sways and Bobs with lag */}
      <div 
        className="pixelated"
        style={{
          width: '32px',
          height: '32px',
          backgroundPosition: `${headPos.x}px ${headPos.y}px`,
          backgroundSize: '256px 256px',
          bottom: '68px',
          transform: `translateX(calc(-50% + ${headSway}px)) translateY(${headBob + bob}px)`,
          zIndex: 2
        }}
      />
    </div>
  );
}
