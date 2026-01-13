'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Player, formatTime, getRemainingTime, isGameOver, getGreekWord } from '@/lib/gameSession';

type GameClientProps = {
  initialPlayer: Player;
  playerToken: string;
};

export default function GameClient({ initialPlayer, playerToken }: GameClientProps) {
  const router = useRouter();
  const player = initialPlayer; // We use the prop as initial state, but we'll re-fetch for updates
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showHelp, setShowHelp] = useState(false);
  const [gamePlayer, setGamePlayer] = useState<Player>(initialPlayer);

  // Poll for updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/game/status?playerToken=${playerToken}`);
        if (response.ok) {
          const data = await response.json();
          if (data.player) {
            setGamePlayer(data.player);
          }
          if (data.session) {
            const remaining = getRemainingTime(data.session);
            setTimeRemaining(remaining);
            
            if (isGameOver(data.session) && data.player.status !== 'completed') {
               // We handle game over redirection here if needed, or rely on phase check
            }
          }
        }
      } catch (error) {
        console.error('Failed to poll game status', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playerToken]);

  const getPhase = () => {
    if (gamePlayer.status === 'completed') return 'complete';
    if (gamePlayer.bonusCompleted) return 'complete';
    if (gamePlayer.miniGameCompleted) return 'bonus';
    if (gamePlayer.meaningCompleted) return 'mini-game';
    if (gamePlayer.morseCompleted) return 'meaning';
    return 'morse';
  };

  const phase = getPhase();

  if (phase === 'complete') {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8 text-center">
          <div className="text-4xl font-bold mb-8">MISSION COMPLETE</div>
          <div className="border-2 border-green-400 p-8 space-y-6">
            <div>
              Excellent work, {gamePlayer.name}.
            </div>
            <div>
              Stand by for the final escape sequence.
            </div>
            <div className="text-sm opacity-70">
              Your contribution has been recorded. Awaiting team completion.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with timer */}
        <div className="border-2 border-cyan-400 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="text-sm">TRANSMISSION ACTIVE</div>
            <div className={`text-2xl font-bold ${timeRemaining < 60000 ? 'text-red-500 animate-pulse' : ''}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* Content area */}
        {phase === 'morse' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold">TRANSMISSION INCOMING</div>
              <div className="text-sm opacity-70">Decode the audio signal</div>
            </div>

            <MorsePuzzle player={gamePlayer} playerToken={playerToken} showHelp={showHelp} setShowHelp={setShowHelp} />
          </div>
        )}

        {phase === 'meaning' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold">SELECT MEANING</div>
              <div className="text-sm opacity-70">Choose the correct interpretation</div>
            </div>

            <MeaningPuzzle player={gamePlayer} playerToken={playerToken} />
          </div>
        )}

        {phase === 'mini-game' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold">NEUTRALIZE THREATS</div>
              <div className="text-sm opacity-70">Eliminate incoming objects</div>
            </div>

            <MiniGame playerToken={playerToken} />
          </div>
        )}

        {phase === 'bonus' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-2xl font-bold">FINAL CHALLENGE</div>
              <div className="text-sm opacity-70">Answer the bonus questions</div>
            </div>

            <BonusPuzzle playerToken={playerToken} />
          </div>
        )}
      </div>
    </div>
  );
}

function MorsePuzzle({ player, playerToken, showHelp, setShowHelp }: { player: Player; playerToken: string; showHelp: boolean; setShowHelp: (show: boolean) => void }) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePlay = () => {
    const morse = textToMorse(player.morseWord);
    playMorseAudio(morse);
  };

  const handleSubmit = async () => {
    const response = await fetch('/api/game/morse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerToken, answer }),
    });

    const data = await response.json();

    if (data.correct) {
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setError(`Incorrect. Attempts: ${data.attempts}/${data.maxAttempts}`);
      setAnswer('');
    }
  };

  const MORSE_CODE: { [key: string]: string } = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.',
  };

  function textToMorse(text: string): string {
    return text
      .toUpperCase()
      .split('')
      .map((char) => MORSE_CODE[char] || '')
      .join(' ');
  }

  function playMorseAudio(morse: string): void {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const dotDuration = 100;
    const dashDuration = dotDuration * 3;
    const gapDuration = dotDuration;
    const letterGap = dotDuration * 3;
    
    let currentTime = audioContext.currentTime;
    
    morse.split('').forEach((symbol) => {
      if (symbol === '.') {
        playTone(audioContext, currentTime, dotDuration);
        currentTime += (dotDuration + gapDuration) / 1000;
      } else if (symbol === '-') {
        playTone(audioContext, currentTime, dashDuration);
        currentTime += (dashDuration + gapDuration) / 1000;
      } else if (symbol === ' ') {
        currentTime += letterGap / 1000;
      }
    });
  }

  function playTone(audioContext: AudioContext, startTime: number, duration: number): void {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 600;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.setValueAtTime(0.3, startTime + duration / 1000);
    gainNode.gain.setValueAtTime(0, startTime + duration / 1000 + 0.01);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration / 1000 + 0.01);
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-green-400">ACCESS GRANTED</div>
        <div className="text-sm">Proceeding to next phase...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-cyan-400 p-8 space-y-6">
        <div className="flex justify-center">
          <button
            onClick={handlePlay}
            className="border-2 border-cyan-400 px-12 py-6 text-xl font-bold hover:bg-cyan-400 hover:text-black transition-all"
          >
            🔊 PLAY TRANSMISSION
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-sm opacity-70">Enter translation:</div>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value.toUpperCase())}
            placeholder="Enter decoded message"
            className="w-full bg-black border border-cyan-400 px-4 py-3 text-cyan-400 text-center text-xl tracking-widest focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] placeholder-cyan-700 uppercase"
            maxLength={20}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className={`border-2 border-cyan-400 px-12 py-4 text-xl font-bold transition-all ${
              answer.trim()
                ? 'hover:bg-cyan-400 hover:text-black shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                : 'opacity-30 cursor-not-allowed'
            }`}
          >
            SUBMIT
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-sm opacity-70 hover:opacity-100"
          >
            [NEED HELP?]
          </button>
        </div>

        {showHelp && (
          <div className="border border-cyan-400 p-4 text-sm">
            <div className="font-bold mb-2">MORSE CODE REFERENCE</div>
            <div className="grid grid-cols-6 gap-2 text-xs">
              {Object.entries(MORSE_CODE).map(([char, code]) => (
                <div key={char}>{char}: {code}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MeaningPuzzle({ player, playerToken }: { player: Player; playerToken: string }) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const greekWord = getGreekWord(player.greekWordIndex);

  const allOptions = [
    greekWord.meaning,
    'word, reason, principle',
    'soul, spirit, breath',
    'sky, heaven, upper air',
    'time, season, opportunity',
  ];

  const [options] = useState(() => [...allOptions].sort(() => Math.random() - 0.5));

  const handleSubmit = async (selected: string) => {
    const response = await fetch('/api/game/meaning', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerToken, answer: selected }),
    });

    const data = await response.json();

    if (data.correct) {
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setError(`Incorrect. Attempts: ${data.attempts}/${data.maxAttempts}`);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-green-400">CORRECT</div>
        <div className="text-sm">Proceeding to next phase...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-cyan-400 p-8 space-y-6">
        <div className="text-center text-4xl font-bold mb-8">
          {greekWord.word}
        </div>

        <div className="text-center text-sm opacity-70 mb-8">
          Select the meaning
        </div>

        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSubmit(option)}
              className="w-full border border-cyan-400 px-6 py-4 text-left hover:bg-cyan-400 hover:text-black transition-all"
            >
              {option}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
      </div>
    </div>
  );
}

function MiniGame({ playerToken }: { playerToken: string }) {
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let spawnInterval: NodeJS.Timeout;

    if (!gameOver) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      spawnInterval = setInterval(() => {
        const newTarget = {
          id: Date.now(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20,
        };
        setTargets((prev) => [...prev.slice(-4), newTarget]);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      clearInterval(spawnInterval);
    };
  }, [gameOver]);

  const handleHit = (id: number) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
    setScore((prev) => prev + 10);
  };

  const handleFinish = async () => {
    const response = await fetch('/api/game/mini-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerToken, score }),
    });

    if (response.ok) {
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  if (gameOver) {
    return (
      <div className="space-y-6">
        <div className="border-2 border-cyan-400 p-8 text-center space-y-6">
          <div className="text-2xl font-bold">MISSION COMPLETE</div>
          <div className="text-4xl font-bold text-yellow-400">{score} POINTS</div>
          <button
            onClick={handleFinish}
            className="border-2 border-green-400 px-12 py-4 text-xl font-bold hover:bg-green-400 hover:text-black transition-all"
          >
            SUBMIT SCORE
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-green-400">SCORE RECORDED</div>
        <div className="text-sm">Proceeding to next phase...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-cyan-400 p-4 flex justify-between">
        <div>SCORE: {score}</div>
        <div>TIME: {timeLeft}s</div>
      </div>

      <div className="border-2 border-cyan-400 p-4 relative" style={{ height: '400px' }}>
        {targets.map((target) => (
          <button
            key={target.id}
            onClick={() => handleHit(target.id)}
            className="absolute w-8 h-8 bg-red-500 hover:bg-red-400 rounded-full transition-all shadow-[0_0_10px_rgba(255,0,0,0.5)]"
            style={{ left: `${target.x}%`, top: `${target.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <span className="sr-only">Target</span>
          </button>
        ))}
      </div>

      <div className="text-center text-sm opacity-70">
        Click on the targets to neutralize them
      </div>
    </div>
  );
}

function BonusPuzzle({ playerToken }: { playerToken: string }) {
  const [q1Answer, setQ1Answer] = useState('');
  const [q2Answer, setQ2Answer] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const q1Correct = q1Answer.toLowerCase().includes('hydrogen') || q1Answer.toLowerCase() === 'h';
    const q2Correct = q2Answer.toLowerCase().includes('mars') || q2Answer.toLowerCase() === 'red planet';

    const response = await fetch('/api/game/bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerToken, q1Correct, q2Correct }),
    });

    if (response.ok) {
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setError('Failed to submit answers');
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl font-bold text-green-400">ALL COMPLETE</div>
        <div className="text-sm">Stand by for escape sequence...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-2 border-cyan-400 p-8 space-y-8">
        <div className="space-y-4">
          <div className="font-bold">QUESTION 1:</div>
          <div className="opacity-90">What is the most abundant element in the universe?</div>
          <input
            type="text"
            value={q1Answer}
            onChange={(e) => setQ1Answer(e.target.value)}
            placeholder="Enter your answer"
            className="w-full bg-black border border-cyan-400 px-4 py-3 text-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] placeholder-cyan-700"
          />
        </div>

        <div className="space-y-4">
          <div className="font-bold">QUESTION 2:</div>
          <div className="opacity-90">Which planet is known as the Red Planet?</div>
          <input
            type="text"
            value={q2Answer}
            onChange={(e) => setQ2Answer(e.target.value)}
            placeholder="Enter your answer"
            className="w-full bg-black border border-cyan-400 px-4 py-3 text-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] placeholder-cyan-700"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={!q1Answer.trim() || !q2Answer.trim()}
            className={`border-2 border-cyan-400 px-12 py-4 text-xl font-bold transition-all ${
              q1Answer.trim() && q2Answer.trim()
                ? 'hover:bg-cyan-400 hover:text-black shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                : 'opacity-30 cursor-not-allowed'
            }`}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}
