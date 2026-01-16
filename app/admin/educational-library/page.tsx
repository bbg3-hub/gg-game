'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminSession } from '@/lib/adminAuth';
import { EducationalPuzzle, convertPuzzleToQuestion } from '@/lib/educationalPuzzles';
import { generateQuestionId, generatePhaseId } from '@/lib/gameBuilder';
import type { GamePhase, Question } from '@/lib/gameSession';
import PuzzleLibraryBrowser from '@/components/PuzzleLibraryBrowser';

type ViewMode = 'browse' | 'game';

interface GameSessionSummary {
  id: string;
  title?: string;
  gameCode: string;
  phases: GamePhase[];
}

export default function EducationalLibraryPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [gameSessions, setGameSessions] = useState<GameSessionSummary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('');
  const [addedPuzzles, setAddedPuzzles] = useState<number>(0);
  const [addingPuzzles, setAddingPuzzles] = useState(false);

  useEffect(() => {
    const adminSession = getAdminSession();
    if (!adminSession) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    loadGameSessions();
  }, [router]);

  const loadGameSessions = async () => {
    try {
      const adminSession = getAdminSession();
      if (!adminSession) return;
      
      const response = await fetch(`/api/admin/sessions?adminId=${adminSession.adminId}`);
      const data = await response.json();
      
      const sessions: GameSessionSummary[] = (data.sessions || []).map((s: { id: string; title?: string; gameCode: string; phases?: GamePhase[] }) => ({
        id: s.id,
        title: s.title || s.gameCode,
        gameCode: s.gameCode,
        phases: s.phases || [],
      }));
      setGameSessions(sessions);
      
      if (sessions.length > 0) {
        setSelectedSessionId(sessions[0].id);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const handleAddPuzzlesToGame = async (puzzles: EducationalPuzzle[]) => {
    if (!selectedSessionId) {
      alert('Please select a game session first');
      return;
    }

    setAddingPuzzles(true);
    try {
      const adminSession = getAdminSession();
      if (!adminSession) return;

      // Fetch current session
      const response = await fetch(`/api/admin/sessions?adminId=${adminSession.adminId}`);
      const data = await response.json();
      const session = data.sessions?.find((s: { id: string }) => s.id === selectedSessionId);
      
      if (!session) {
        throw new Error('Session not found');
      }

      // Create or get existing phase for educational puzzles
      let targetPhaseId = selectedPhaseId;
      const phases = session.phases || [];

      if (!targetPhaseId || !phases.find((p: GamePhase) => p.id === targetPhaseId)) {
        // Create new phase for educational puzzles
        const newPhase: GamePhase = {
          id: generatePhaseId(),
          name: 'Educational Challenges',
          description: 'Real-world puzzles and problems',
          order: phases.length,
          questions: [],
        };
        phases.push(newPhase);
        targetPhaseId = newPhase.id;
      }

      // Add puzzles to phase
      const phaseIndex = phases.findIndex((p: GamePhase) => p.id === targetPhaseId);
      if (phaseIndex === -1) {
        throw new Error('Phase not found');
      }

      const existingQuestions = phases[phaseIndex].questions || [];
      const newQuestions: Question[] = puzzles.map((puzzle) => {
        const questionData = convertPuzzleToQuestion(puzzle);
        const basePoints = puzzle.difficulty === 'easy' ? 100 : puzzle.difficulty === 'medium' ? 150 : 200;
        return {
          id: generateQuestionId(),
          ...questionData,
          type: 'text' as const,
          points: basePoints,
          options: undefined,
        };
      });

      phases[phaseIndex].questions = [...existingQuestions, ...newQuestions];

      // Save updated session
      const saveResponse = await fetch('/api/admin/save-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...session,
          phases,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save game');
      }

      setAddedPuzzles(puzzles.length);
      setTimeout(() => setAddedPuzzles(0), 3000);
    } catch (error) {
      console.error('Failed to add puzzles:', error);
      alert('Failed to add puzzles to game');
    } finally {
      setAddingPuzzles(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 border border-gray-600 hover:border-cyan-400 transition-all"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-yellow-400">Educational Puzzle Library</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setViewMode('browse')}
              className={`px-4 py-2 border transition-all ${
                viewMode === 'browse'
                  ? 'bg-cyan-400 text-black'
                  : 'border-cyan-400 hover:bg-cyan-900'
              }`}
            >
              Browse Puzzles
            </button>
            <button
              onClick={() => setViewMode('game')}
              className={`px-4 py-2 border transition-all ${
                viewMode === 'game'
                  ? 'bg-cyan-400 text-black'
                  : 'border-cyan-400 hover:bg-cyan-900'
              }`}
            >
              Add to Game
            </button>
          </div>
        </div>
      </div>

      {/* Add to Game Panel */}
      {viewMode === 'game' && (
        <div className="border-b border-gray-800 p-4 bg-gray-900">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-bold text-cyan-400 mb-2">
                Select Game Session
              </label>
              <select
                value={selectedSessionId}
                onChange={(e) => {
                  setSelectedSessionId(e.target.value);
                  setSelectedPhaseId('');
                }}
                className="w-full bg-black border border-cyan-400 rounded px-4 py-2 focus:outline-none"
              >
                <option value="">Select a game...</option>
                {gameSessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.title} ({session.gameCode})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-cyan-400 mb-2">
                Select Phase (or will create new)
              </label>
              <select
                value={selectedPhaseId}
                onChange={(e) => setSelectedPhaseId(e.target.value)}
                className="w-full bg-black border border-cyan-400 rounded px-4 py-2 focus:outline-none"
                disabled={!selectedSessionId}
              >
                <option value="">Create new phase</option>
                {selectedSessionId && gameSessions.find(s => s.id === selectedSessionId)?.phases.map((phase: GamePhase) => (
                  <option key={phase.id} value={phase.id}>
                    {phase.name} ({phase.questions?.length || 0} questions)
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-400">
              {addedPuzzles > 0 && (
                <span className="text-green-400">✓ Added {addedPuzzles} puzzles!</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Puzzle Browser */}
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <PuzzleLibraryBrowser
            onAddToGame={viewMode === 'game' ? handleAddPuzzlesToGame : undefined}
            multiSelect={viewMode === 'game'}
          />
        </div>
      </div>

      {/* Loading Overlay */}
      {addingPuzzles && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin">⏳</div>
            <div className="text-xl text-cyan-400">Adding puzzles to game...</div>
          </div>
        </div>
      )}
    </div>
  );
}
