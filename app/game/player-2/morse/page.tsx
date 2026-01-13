'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadGameState, updatePlayerProgress, textToMorse, playMorseAudio } from '@/lib/gameLogic';

const MORSE_WORDS = ['OXYGEN', 'ESCAPE', 'SIGNAL', 'RESCUE', 'BEACON'];

export default function MorsePage() {
  const router = useRouter();
  const playerId = 'player-2';
  
  const [puzzleData] = useState(() => {
    const randomWord = MORSE_WORDS[Math.floor(Math.random() * MORSE_WORDS.length)];
    return { word: randomWord, morse: textToMorse(randomWord) };
  });
  
  const word = puzzleData.word;
  const morse = puzzleData.morse;
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showDecoder, setShowDecoder] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const gameState = loadGameState();
    if (!gameState) {
      router.push('/game/setup');
      return;
    }

    const player = gameState.players.find((p) => p.id === playerId);
    if (player?.morseCompleted) {
      router.push('/game');
      return;
    }
  }, [router]);

  const handlePlayAudio = () => {
    if (morse) {
      playMorseAudio(morse);
    }
  };

  const handleSubmit = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (input.toUpperCase() === word) {
      const score = Math.max(100 - (newAttempts - 1) * 30, 10);
      const gameState = loadGameState();
      if (gameState) {
        updatePlayerProgress(gameState, playerId, 'morse', score);
      }
      setMessage(`✓ CORRECT! [+${score} pts]`);
      setTimeout(() => router.push('/game'), 2000);
    } else {
      if (newAttempts >= 3) {
        const gameState = loadGameState();
        if (gameState) {
          updatePlayerProgress(gameState, playerId, 'morse', 10);
        }
        setMessage('✗ FAILED - RETURNING TO BASE [+10 pts]');
        setTimeout(() => router.push('/game'), 2000);
      } else {
        setMessage(`✗ INCORRECT - ${3 - newAttempts} attempts remaining`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border-2 border-cyan-400 p-6 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold">MORSE CODE PROTOCOL</div>
            <div className="text-sm opacity-70">[PLAYER 2 - DECODER STATION]</div>
          </div>
        </div>

        <div className="border border-cyan-400 p-6 space-y-4">
          <div className="text-center space-y-4">
            <div className="text-sm">INCOMING TRANSMISSION:</div>
            <div className="text-2xl font-bold tracking-widest p-4 bg-black border border-cyan-400">
              {morse}
            </div>
            <button
              onClick={handlePlayAudio}
              className="border-2 border-cyan-400 px-6 py-2 hover:bg-cyan-400 hover:text-black transition-all"
            >
              ▶ PLAY AUDIO
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-sm">DECODE MESSAGE:</div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter decoded word"
              className="w-full bg-black border border-cyan-400 px-4 py-3 text-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] placeholder-cyan-700"
              disabled={attempts >= 3}
            />
          </div>

          {message && (
            <div className={`text-center text-lg font-bold ${message.includes('✓') ? 'text-green-400' : 'text-red-500'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="text-sm">ATTEMPTS: {attempts}/3</div>
            <div className="space-x-2">
              <button
                onClick={() => setShowDecoder(!showDecoder)}
                className="border border-cyan-400 px-4 py-2 text-xs hover:bg-cyan-400 hover:text-black transition-all"
              >
                {showDecoder ? 'HIDE DECODER' : 'SHOW DECODER'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={attempts >= 3 || !input.trim()}
                className="border-2 border-cyan-400 px-8 py-2 hover:bg-cyan-400 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                SUBMIT
              </button>
            </div>
          </div>

          {showDecoder && (
            <div className="border border-cyan-400 p-4 bg-black/50 text-xs grid grid-cols-4 gap-2">
              {Object.entries({ A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..' }).map(([letter, code]) => (
                <div key={letter} className="flex justify-between">
                  <span>{letter}:</span>
                  <span>{code}</span>
                </div>
              ))}
            </div>
          )}
        </div>

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
