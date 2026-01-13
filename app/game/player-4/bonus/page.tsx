'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadGameState, updatePlayerProgress } from '@/lib/gameLogic';

const BONUS_QUESTIONS = [
  {
    question: 'What is the speed of light in vacuum?',
    answers: ['299,792,458 m/s', '300,000,000 m/s', '299,000,000 m/s', '298,792,458 m/s'],
    correct: 0,
  },
  {
    question: 'Which planet has the most moons?',
    answers: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correct: 1,
  },
  {
    question: 'What is the chemical symbol for gold?',
    answers: ['Go', 'Gd', 'Au', 'Ag'],
    correct: 2,
  },
  {
    question: 'Who developed the theory of relativity?',
    answers: ['Isaac Newton', 'Galileo Galilei', 'Albert Einstein', 'Stephen Hawking'],
    correct: 2,
  },
  {
    question: 'What is the largest organ in the human body?',
    answers: ['Heart', 'Brain', 'Liver', 'Skin'],
    correct: 3,
  },
];

export default function BonusPage() {
  const router = useRouter();
  const playerId = 'player-4';
  const playerIndex = parseInt(playerId.split('-')[1]) - 1;
  const [currentQuestion] = useState(() => playerIndex % BONUS_QUESTIONS.length);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState('');
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);

  useEffect(() => {
    const gameState = loadGameState();
    if (!gameState) {
      router.push('/game/setup');
      return;
    }

    const player = gameState.players.find((p) => p.id === playerId);
    if (player?.bonusCompleted) {
      router.push('/game');
      return;
    }
  }, [router]);

  const handleAnswer = (selectedIndex: number) => {
    const question = BONUS_QUESTIONS[currentQuestion];
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (selectedIndex === question.correct) {
      const points = newAttempts === 1 ? 50 : 25;
      const newScore = score + points;
      setScore(newScore);
      setAnsweredCorrectly(true);
      setMessage(`✓ CORRECT! [+${points} pts]`);

      const gameState = loadGameState();
      if (gameState) {
        updatePlayerProgress(gameState, playerId, 'bonus', newScore);
      }

      setTimeout(() => router.push('/game'), 2000);
    } else {
      if (newAttempts >= 2) {
        const gameState = loadGameState();
        if (gameState) {
          updatePlayerProgress(gameState, playerId, 'bonus', score || 10);
        }
        setMessage(`✗ FAILED - RETURNING TO BASE [+${score || 10} pts]`);
        setTimeout(() => router.push('/game'), 2000);
      } else {
        setMessage('✗ INCORRECT - 1 attempt remaining');
      }
    }
  };

  const question = BONUS_QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="border-2 border-cyan-400 p-6 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold">BONUS SECURITY PROTOCOL</div>
            <div className="text-sm opacity-70">[PLAYER 4 - KNOWLEDGE VERIFICATION]</div>
          </div>
        </div>

        <div className="border border-cyan-400 p-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="text-sm">SECURITY QUESTION:</div>
            <div className="text-xl font-bold p-6 bg-black border border-cyan-400">
              {question.question}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-center">SELECT YOUR ANSWER:</div>
            <div className="grid grid-cols-1 gap-3">
              {question.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={attempts >= 2 || answeredCorrectly}
                  className="border-2 border-cyan-400 px-6 py-4 text-lg hover:bg-cyan-400 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed text-left"
                >
                  {String.fromCharCode(65 + index)}. {answer}
                </button>
              ))}
            </div>
          </div>

          {message && (
            <div className={`text-center text-lg font-bold ${message.includes('✓') ? 'text-green-400' : 'text-red-500'}`}>
              {message}
            </div>
          )}

          <div className="text-sm text-center">
            ATTEMPTS: {attempts}/2 | SCORE: {score} pts
          </div>
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
