'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAdminSession, getAdminSession } from '@/lib/adminAuth';
import type { GameSession } from '@/lib/gameSession';
import {
  DEFAULT_GREEK_WORDS,
  DEFAULT_MORSE_WORDS,
  formatTime,
  getEffectiveGreekWords,
  getEffectiveMaxMeaningAttempts,
  getEffectiveMaxMorseAttempts,
  getEffectiveMorseWords,
  getEffectiveOxygenMinutes,
  getRemainingTime,
  hasCustomPuzzles,
} from '@/lib/gameSession';
import PuzzleEditor from '@/app/admin/puzzle-editor';

function formatAge(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<GameSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});
  const [adminId, setAdminId] = useState<string | null>(null);

  const selectedSession = useMemo(() => {
    if (!selectedSessionId) return null;
    return sessions.find((s) => s.id === selectedSessionId) || null;
  }, [selectedSessionId, sessions]);

  const loadSessions = useCallback(
    async (adminId: string) => {
      try {
        const response = await fetch(`/api/admin/sessions?adminId=${adminId}`);
        const data = await response.json();

        const nextSessions: GameSession[] = (data.sessions || []).slice().sort((a: GameSession, b: GameSession) => b.createdAt - a.createdAt);
        setSessions(nextSessions);

        if (selectedSessionId && !nextSessions.some((s) => s.id === selectedSessionId)) {
          setSelectedSessionId(null);
        }

        if (editingSession && !nextSessions.some((s) => s.id === editingSession.id)) {
          setEditingSession(null);
        }
      } catch {
        console.error('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    },
    [selectedSessionId, editingSession]
  );

  useEffect(() => {
    const session = getAdminSession();
    if (!session) {
      router.push('/admin');
      return;
    }

    setAdminId(session.adminId);
    loadSessions(session.adminId);
  }, [router, loadSessions]);

  useEffect(() => {
    const session = getAdminSession();
    if (!session) return;

    const refreshInterval = setInterval(() => {
      loadSessions(session.adminId);
    }, 3000);

    return () => clearInterval(refreshInterval);
  }, [loadSessions]);

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
      if (selectedSessionId === sessionId) {
        setSelectedSessionId(null);
      }
    } catch {
      alert('Failed to delete game');
    }
  };

  const handleExport = async () => {
    const session = getAdminSession();
    if (!session) return;

    try {
      const response = await fetch('/api/admin/export-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: session.adminId }),
      });

      if (!response.ok) {
        alert('Failed to export sessions');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="?([^\"]+)"?/);
      a.download = filenameMatch?.[1] || 'sessions-backup.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export sessions');
    }
  };

  const handleDuplicateSession = async (source: GameSession) => {
    const session = getAdminSession();
    if (!session) return;

    try {
      const response = await fetch('/api/admin/create-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: session.adminId }),
      });

      if (!response.ok) {
        alert('Failed to duplicate session');
        return;
      }

      const data = await response.json();
      const newSessionId = data.session?.id;
      if (!newSessionId) {
        alert('Failed to duplicate session');
        return;
      }

      await fetch('/api/admin/update-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: session.adminId,
          sessionId: newSessionId,
          customMorseWords: source.customMorseWords,
          customGreekWords: source.customGreekWords,
          customMaxMorseAttempts: source.customMaxMorseAttempts,
          customMaxMeaningAttempts: source.customMaxMeaningAttempts,
          customOxygenMinutes: source.customOxygenMinutes,
        }),
      });

      await loadSessions(session.adminId);
    } catch {
      alert('Failed to duplicate session');
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

        <div className="border-2 border-cyan-400 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <div className="text-xl font-bold">ACTIVE MISSIONS</div>
              <div className="text-sm opacity-70">Total sessions: {sessions.length}</div>
            </div>
            <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => router.push('/admin/educational-library')}
              className="border border-purple-400 px-6 py-3 font-bold hover:bg-purple-400 hover:text-black transition-all"
            >
              [PUZZLE LIBRARY]
            </button>
            <button
              onClick={() => router.push('/admin/builder')}
              className="border border-cyan-400 px-6 py-3 font-bold hover:bg-cyan-400 hover:text-black transition-all"
            >
              [GAME BUILDER]
            </button>
              <button
                onClick={handleExport}
                className="border border-yellow-400 px-6 py-3 font-bold hover:bg-yellow-400 hover:text-black transition-all"
              >
                [EXPORT BACKUP]
              </button>
              <button
                onClick={handleCreateGame}
                className="border-2 border-green-400 px-8 py-3 font-bold hover:bg-green-400 hover:text-black transition-all shadow-[0_0_10px_rgba(0,255,0,0.3)]"
              >
                [+ NEW MISSION]
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`border-2 p-6 cursor-pointer transition-all ${
                selectedSessionId === session.id
                  ? 'border-yellow-400 shadow-[0_0_20px_rgba(255,255,0,0.5)]'
                  : 'border-cyan-400 hover:border-yellow-400'
              }`}
              onClick={() => setSelectedSessionId(session.id)}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-yellow-400">{session.gameCode}</div>
                      {hasCustomPuzzles(session) && (
                        <span className="text-xs border border-green-400 text-green-400 px-2 py-1">CUSTOM</span>
                      )}
                    </div>
                    <div className="text-sm opacity-70">{session.status.toUpperCase()}</div>
                    <div className="text-xs opacity-60">
                      Created: {new Date(session.createdAt).toLocaleString()} ({formatAge(Date.now() - session.createdAt)} ago)
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSession(session);
                      }}
                      className="text-cyan-400 hover:text-yellow-400 text-sm"
                    >
                      [EDIT PUZZLES]
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateSession(session);
                      }}
                      className="text-green-400 hover:text-green-300 text-sm"
                    >
                      [DUPLICATE]
                    </button>
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
                  <div className="text-sm text-green-400">CODE READY: {session.finalEscapeCode}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedSession && (
          <div className="border-2 border-yellow-400 p-6 space-y-6">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div className="text-xl font-bold text-yellow-400">MISSION DETAILS: {selectedSession.gameCode}</div>
              <div className="text-sm opacity-70">Session ID: {selectedSession.id.slice(-8)}</div>
            </div>

            <div className="border border-cyan-400 p-4 space-y-2">
              <div className="text-lg font-bold">PUZZLE CONFIGURATION</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  Oxygen: {getEffectiveOxygenMinutes(selectedSession)} min
                  {typeof selectedSession.customOxygenMinutes === 'number' && <span className="text-green-400"> (custom)</span>}
                </div>
                <div>
                  Max Attempts: Morse {getEffectiveMaxMorseAttempts(selectedSession)} / Meaning {getEffectiveMaxMeaningAttempts(selectedSession)}
                </div>
                <div>
                  Morse Words: {getEffectiveMorseWords(selectedSession).length}
                  {selectedSession.customMorseWords ? <span className="text-green-400"> (custom)</span> : <span className="opacity-70"> (default {DEFAULT_MORSE_WORDS.length})</span>}
                </div>
                <div>
                  Greek Words: {getEffectiveGreekWords(selectedSession).length}
                  {selectedSession.customGreekWords ? <span className="text-green-400"> (custom)</span> : <span className="opacity-70"> (default {DEFAULT_GREEK_WORDS.length})</span>}
                </div>
              </div>
            </div>

            {selectedSession.startTime && (
              <div className="border border-cyan-400 p-4">
                <div className="text-sm mb-2">OXYGEN REMAINING</div>
                <div className={`text-4xl font-bold ${timeRemaining[selectedSession.id] < 60000 ? 'text-red-500 animate-pulse' : ''}`}>
                  {formatTime(timeRemaining[selectedSession.id] || 0)}
                </div>
              </div>
            )}

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
                          Morse: {player.morseCompleted ? '✓' : '✗'} ({player.morseAttempts}/{getEffectiveMaxMorseAttempts(selectedSession)})
                        </div>
                        <div>
                          Meaning: {player.meaningCompleted ? '✓' : '✗'} ({player.meaningAttempts}/{getEffectiveMaxMeaningAttempts(selectedSession)})
                        </div>
                        <div>
                          Mini-Game: {player.miniGameCompleted ? `✓ (${player.miniGameScore})` : '✗'}
                        </div>
                        <div>
                          Bonus: {player.bonusCompleted ? '✓' : '✗'}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-cyan-400 text-sm">Score: {player.totalScore} points</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedSession.finalEscapeCode ? (
              <div className="border-2 border-green-400 p-6 text-center space-y-4">
                <div className="text-2xl font-bold text-green-400">ESCAPE CODE READY</div>
                <div className="text-4xl font-bold tracking-widest">{selectedSession.finalEscapeCode}</div>
                <div className="text-sm opacity-70">Share this code with all completed players</div>
              </div>
            ) : (
              <div className="border border-red-500 p-6 text-center space-y-4">
                <div className="text-xl font-bold text-red-500">ESCAPE CODE LOCKED</div>
                <div className="text-sm opacity-70">Waiting for all players to complete their missions</div>
              </div>
            )}
          </div>
        )}
      </div>

      {editingSession && adminId && (
        <PuzzleEditor
          session={editingSession}
          adminId={adminId}
          onClose={() => setEditingSession(null)}
          onSave={async () => {
            await loadSessions(adminId);
            setEditingSession(null);
          }}
        />
      )}
    </div>
  );
}
