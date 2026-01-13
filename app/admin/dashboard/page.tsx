'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminSession, clearAdminSession } from '@/lib/adminAuth';
import type { GameSession } from '@/lib/gameSession';
import { formatTime, getRemainingTime } from '@/lib/gameSession';

export default function AdminDashboard() {
  const router = useRouter();
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<GameSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});

  useEffect(() => {
    const session = getAdminSession();
    if (!session) {
      router.push('/admin');
      return;
    }

    loadSessions(session.adminId);
  }, [router]);

  // Auto-refresh sessions every 3 seconds to show new players joining
  useEffect(() => {
    const session = getAdminSession();
    if (!session) return;

    const refreshInterval = setInterval(() => {
      loadSessions(session.adminId);
    }, 3000);

    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      sessions.forEach((session) => {
        if (session.startTime) {
          setTimeRemaining((prev) => ({
            ...prev,
            [session.id]: getRemainingTime(session),
          }));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessions]);

  const loadSessions = async (adminId: string) => {
    try {
      const response = await fetch(`/api/admin/sessions?adminId=${adminId}`);
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch {
      console.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = async () => {
    const session = getAdminSession();
    if (!session) return;

    try {
      const response = await fetch('/api/admin/create-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: session.adminId }),
      });

      if (!response.ok) {
        alert('Failed to create game');
        return;
      }

      await loadSessions(session.adminId);
    } catch {
      alert('Failed to create game');
    }
  };

  const handleDeleteGame = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this game session?')) return;

    const session = getAdminSession();
    if (!session) return;

    try {
      await fetch(`/api/admin/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      await loadSessions(session.adminId);
      if (selectedSession?.id === sessionId) {
        setSelectedSession(null);
      }
    } catch {
      alert('Failed to delete game');
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    router.push('/');
  };

  const getActivePlayersCount = (session: GameSession) => {
    return session.players.filter((p) => p.status !== 'joined').length;
  };

  const getCompletedPlayersCount = (session: GameSession) => {
    return session.players.filter((p) => p.status === 'completed').length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 font-mono flex items-center justify-center">
        <div>LOADING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-2 border-yellow-400 p-6 shadow-[0_0_20px_rgba(255,255,0,0.5)]">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400">PROMETHEUS CONTROL CENTER</div>
              <div className="text-sm opacity-70">Mission Command Interface</div>
            </div>
            <button
              onClick={handleLogout}
              className="border border-red-500 px-4 py-2 text-red-500 hover:bg-red-500 hover:text-black transition-all"
            >
              [LOGOUT]
            </button>
          </div>
        </div>

        {/* Create Game Button */}
        <div className="border-2 border-cyan-400 p-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xl font-bold">ACTIVE MISSIONS</div>
              <div className="text-sm opacity-70">Total sessions: {sessions.length}</div>
            </div>
            <button
              onClick={handleCreateGame}
              className="border-2 border-green-400 px-8 py-3 font-bold hover:bg-green-400 hover:text-black transition-all shadow-[0_0_10px_rgba(0,255,0,0.3)]"
            >
              [+ NEW MISSION]
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`border-2 p-6 cursor-pointer transition-all ${selectedSession?.id === session.id
                  ? 'border-yellow-400 shadow-[0_0_20px_rgba(255,255,0,0.5)]'
                  : 'border-cyan-400 hover:border-yellow-400'
                }`}
              onClick={() => setSelectedSession(session)}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">{session.gameCode}</div>
                    <div className="text-sm opacity-70">
                      {session.status.toUpperCase()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGame(session.id);
                    }}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    [DELETE]
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Players: {session.players.length}/4</div>
                  <div>Active: {getActivePlayersCount(session)}</div>
                  <div>Completed: {getCompletedPlayersCount(session)}</div>
                  <div>
                    {session.startTime ? (
                      <span className={timeRemaining[session.id] < 60000 ? 'text-red-500 animate-pulse' : ''}>
                        {formatTime(timeRemaining[session.id] || 0)}
                      </span>
                    ) : (
                      'WAITING'
                    )}
                  </div>
                </div>

                {session.finalEscapeCode && (
                  <div className="text-sm text-green-400">
                    CODE READY: {session.finalEscapeCode}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Session Details */}
        {selectedSession && (
          <div className="border-2 border-yellow-400 p-6 space-y-6">
            <div className="text-xl font-bold text-yellow-400">
              MISSION DETAILS: {selectedSession.gameCode}
            </div>

            {/* Oxygen Timer */}
            {selectedSession.startTime && (
              <div className="border border-cyan-400 p-4">
                <div className="text-sm mb-2">OXYGEN REMAINING</div>
                <div className={`text-4xl font-bold ${timeRemaining[selectedSession.id] < 60000 ? 'text-red-500 animate-pulse' : ''}`}>
                  {formatTime(timeRemaining[selectedSession.id] || 0)}
                </div>
              </div>
            )}

            {/* Players */}
            <div className="space-y-4">
              <div className="text-lg font-bold">CREW STATUS</div>
              {selectedSession.players.length === 0 ? (
                <div className="text-sm opacity-50">No players have joined yet</div>
              ) : (
                <div className="space-y-3">
                  {selectedSession.players.map((player) => (
                    <div key={player.token} className="border border-cyan-400 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-lg">{player.name}</div>
                          <div className="text-sm opacity-70">Token: {player.token.slice(-8)}</div>
                        </div>
                        <div className="text-sm">
                          {player.status === 'completed' && <span className="text-green-400">✓ COMPLETE</span>}
                          {player.status === 'solving' && <span className="text-yellow-400">⏳ IN PROGRESS</span>}
                          {player.status === 'joined' && <span className="text-cyan-400">⌚ JOINED</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Morse: {player.morseCompleted ? '✓' : '✗'} ({player.morseAttempts}/5)
                        </div>
                        <div>
                          Meaning: {player.meaningCompleted ? '✓' : '✗'} ({player.meaningAttempts}/5)
                        </div>
                        <div>
                          Mini-Game: {player.miniGameCompleted ? `✓ (${player.miniGameScore})` : '✗'}
                        </div>
                        <div>
                          Bonus: {player.bonusCompleted ? '✓' : '✗'}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-cyan-400 text-sm">
                        Score: {player.totalScore} points
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Final Code */}
            {selectedSession.finalEscapeCode ? (
              <div className="border-2 border-green-400 p-6 text-center space-y-4">
                <div className="text-2xl font-bold text-green-400">ESCAPE CODE READY</div>
                <div className="text-4xl font-bold tracking-widest">
                  {selectedSession.finalEscapeCode}
                </div>
                <div className="text-sm opacity-70">
                  Share this code with all completed players
                </div>
              </div>
            ) : (
              <div className="border border-red-500 p-6 text-center space-y-4">
                <div className="text-xl font-bold text-red-500">ESCAPE CODE LOCKED</div>
                <div className="text-sm opacity-70">
                  Waiting for all players to complete their missions
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
