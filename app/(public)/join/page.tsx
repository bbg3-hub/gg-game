'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinPage() {
  const router = useRouter();
  const [gameCode, setGameCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [playerToken, setPlayerToken] = useState('');
  const [playerUrl, setPlayerUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/join-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameCode: gameCode.toUpperCase(), playerName }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to join game');
        return;
      }

      setSuccess(true);
      setPlayerToken(data.playerToken);
      setPlayerUrl(data.playerUrl);
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToGame = () => {
    if (playerToken) {
      router.push(`/game/play/${playerToken}`);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 font-mono flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-green-400">ACCESS GRANTED</div>
            <div className="text-sm opacity-70">Your private channel has been established</div>
          </div>

          <div className="border-2 border-green-400 p-8 space-y-6 shadow-[0_0_20px_rgba(0,255,0,0.5)]">
            <div className="space-y-4">
              <div className="text-sm">Welcome, {playerName}</div>
              <div className="text-sm opacity-70">
                Save your personal access link below. You will need it to continue your mission.
              </div>
            </div>

            <div className="bg-black border border-cyan-400 p-4 text-xs break-all opacity-80">
              {playerUrl}
            </div>

            <div className="text-sm text-yellow-400">
              ⚠️ IMPORTANT: Save this link now. It will not be shown again.
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleGoToGame}
                className="border-2 border-green-400 px-12 py-4 text-xl font-bold hover:bg-green-400 hover:text-black transition-all duration-200 shadow-[0_0_15px_rgba(0,255,0,0.3)] hover:shadow-[0_0_25px_rgba(0,255,0,0.8)]"
              >
                &gt;&gt; BEGIN MISSION &lt;&lt;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="text-3xl font-bold">ENTER ACCESS CODE</div>
          <div className="text-sm opacity-70">Provide your mission credentials</div>
        </div>

        <form onSubmit={handleSubmit} className="border-2 border-cyan-400 p-8 space-y-6 shadow-[0_0_20px_rgba(0,255,255,0.5)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">GAME CODE</label>
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                placeholder="e.g., PROM47"
                className="w-full bg-black border border-cyan-400 px-4 py-3 text-cyan-400 text-center text-2xl tracking-widest focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] placeholder-cyan-700 uppercase"
                maxLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">CREW MEMBER DESIGNATION</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-black border border-cyan-400 px-4 py-3 text-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,255,0.5)] placeholder-cyan-700"
                maxLength={20}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center border border-red-500 p-3">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`border-2 border-cyan-400 px-12 py-4 text-xl font-bold transition-all duration-200 ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-cyan-400 hover:text-black shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)]'
              }`}
            >
              {loading ? 'CONNECTING...' : '>> CONNECT <<'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
