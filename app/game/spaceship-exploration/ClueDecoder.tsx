'use client';

import React, { useState, useEffect } from 'react';
import { SpaceshipGameSession } from '@/lib/spaceshipGameSession';
import { ROOM_CONFIGS } from '@/lib/roomConfig';

interface ClueDecoderProps {
  gameState: SpaceshipGameSession;
  onSubmit: (answer: string) => void;
  onClose: () => void;
}

export function ClueDecoder({ gameState, onSubmit, onClose }: ClueDecoderProps) {
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);

  const roomConfig = ROOM_CONFIGS[gameState.currentRoom];
  const clue = roomConfig?.clue;

  useEffect(() => {
    // Auto-focus the input
    const input = document.getElementById('clue-answer');
    if (input) {
      input.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      setFeedback({ type: 'error', message: 'Please enter an answer' });
      return;
    }

    setAttempts(prev => prev + 1);
    
    // Submit the answer
    onSubmit(answer.trim());
    
    // Check if correct (this would be done server-side)
    const correct = answer.trim().toUpperCase() === clue?.decoded.toUpperCase();
    
    if (correct) {
      setFeedback({ type: 'success', message: 'Correct! Clue solved!' });
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setFeedback({ 
        type: 'error', 
        message: `Incorrect. ${(clue?.attempts || 3) - attempts - 1} attempts remaining.` 
      });
      
      if (attempts >= (clue?.attempts || 3) - 1) {
        setFeedback({ 
          type: 'error', 
          message: 'Out of attempts! The correct answer has been revealed.' 
        });
        setShowHint(true);
      }
    }
    
    setAnswer('');
  };

  const getHint = () => {
    if (!clue) return '';
    
    switch (clue.type) {
      case 'MORSE':
        return 'Morse code uses dots and dashes to represent letters';
      case 'CAESAR':
        return 'Each letter is shifted by a fixed number of positions in the alphabet';
      case 'BINARY':
        return 'Binary code represents letters using 1s and 0s (8 bits per letter)';
      case 'SUBSTITUTION':
        return 'Numbers represent letters in the alphabet (A=1, B=2, etc.)';
      case 'PATTERN':
        return 'Look for a pattern or sequence in the symbols';
      default:
        return '';
    }
  };

  if (!clue) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-8 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-mono font-bold text-yellow-400 mb-2">
            🔍 CLUE DECODER
          </h2>
          <p className="text-gray-300 text-sm">
            Room: <span className="text-cyan-400">{roomConfig.name}</span>
          </p>
        </div>

        {/* Clue Display */}
        <div className="bg-black bg-opacity-50 border border-gray-600 rounded p-6 mb-6">
          <div className="text-center">
            <h3 className="text-yellow-400 font-mono text-lg mb-4">ENCRYPTED MESSAGE</h3>
            
            {/* Clue Type Indicator */}
            <div className="mb-4">
              <span className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-mono">
                {clue.type} CIPHER
              </span>
              <span className="ml-2 bg-gray-600 text-white px-3 py-1 rounded text-sm font-mono">
                {clue.difficulty}
              </span>
            </div>

            {/* Encoded Text */}
            <div className="bg-gray-800 border border-gray-500 rounded p-4 mb-4">
              <p className="text-white font-mono text-xl tracking-wider break-all">
                {clue.encoded}
              </p>
            </div>

            {/* Attempts Counter */}
            <div className="text-sm text-gray-400">
              Attempts: <span className="text-yellow-400">{attempts}</span> / {clue.attempts}
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label htmlFor="clue-answer" className="block text-cyan-400 font-mono text-sm mb-2">
              DECODED ANSWER:
            </label>
            <input
              id="clue-answer"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full bg-black border border-gray-600 rounded px-4 py-3 text-white font-mono text-lg text-center focus:border-cyan-400 focus:outline-none"
              placeholder="Enter decoded message..."
              disabled={attempts >= clue.attempts}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={attempts >= clue.attempts}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-mono py-3 px-6 rounded transition-colors"
            >
              SUBMIT ANSWER
            </button>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-mono py-3 px-6 rounded transition-colors"
            >
              {showHint ? 'HIDE HINT' : 'HINT'}
            </button>
          </div>
        </form>

        {/* Hint */}
        {showHint && (
          <div className="bg-blue-900 bg-opacity-50 border border-blue-400 rounded p-4 mb-4">
            <h4 className="text-blue-400 font-mono font-bold mb-2">💡 HINT:</h4>
            <p className="text-blue-200 text-sm font-mono">{getHint()}</p>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`border rounded p-4 mb-4 ${
            feedback.type === 'success' 
              ? 'bg-green-900 border-green-400 text-green-200' 
              : 'bg-red-900 border-red-400 text-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-mono">
                {feedback.type === 'success' ? '✅' : '❌'} {feedback.message}
              </span>
              {feedback.type === 'error' && (
                <button
                  onClick={onClose}
                  className="bg-red-600 hover:bg-red-700 text-white font-mono text-sm px-3 py-1 rounded"
                >
                  SKIP
                </button>
              )}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 font-mono text-sm"
          >
            Press ESC to close
          </button>
        </div>
      </div>
    </div>
  );
}