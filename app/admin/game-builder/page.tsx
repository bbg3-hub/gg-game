'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameSession, GamePhase, Question } from '@/lib/gameSession';
import {
  createEmptyPhase,
  createEmptyQuestion,
  addPhaseToSession,
  updatePhaseInSession,
  removePhaseFromSession,
  reorderPhases,
  addQuestionToPhase,
  updateQuestionInPhase,
  removeQuestionFromPhase,
  validateGameSession,
  calculateTotalPoints,
  exportGameAsJSON,
  saveToLocalStorage,
  loadFromLocalStorage,
} from '@/lib/gameBuilder';
import PhaseManager from '@/components/PhaseManager';
import QuestionEditor from '@/components/QuestionEditor';

type Tab = 'overview' | 'phases' | 'questions' | 'preview' | 'settings';

export default function GameBuilderPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState<Tab>('overview');
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<GamePhase | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminSession');
    if (!adminSession) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);
    const loaded = loadFromLocalStorage();
    setSessions(loaded);
  }, [router]);

  useEffect(() => {
    if (isAuthenticated) {
      saveToLocalStorage(sessions);
    }
  }, [sessions, isAuthenticated]);

  const createNewGame = async () => {
    try {
      const adminSession = sessionStorage.getItem('adminSession');
      if (!adminSession) return;

      const { adminId } = JSON.parse(adminSession);

      const response = await fetch('/api/admin/create-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId }),
      });

      if (!response.ok) throw new Error('Failed to create game');

      const newSession = await response.json();
      newSession.phases = [];
      newSession.title = 'Untitled Game';
      newSession.description = '';
      newSession.settings = {
        oxygenMinutes: 120,
        maxPlayers: 4,
      };

      setSessions([...sessions, newSession]);
      setCurrentSession(newSession);
      setCurrentTab('overview');
    } catch (error) {
      console.error('Failed to create game:', error);
      alert('Failed to create game');
    }
  };

  const saveCurrentGame = async () => {
    if (!currentSession) return;

    const errors = validateGameSession(currentSession);
    if (errors.length > 0) {
      alert('Validation errors:\n' + errors.join('\n'));
      return;
    }

    try {
      const response = await fetch('/api/admin/save-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSession),
      });

      if (!response.ok) throw new Error('Failed to save game');

      alert('Game saved successfully!');
    } catch (error) {
      console.error('Failed to save game:', error);
      alert('Failed to save game');
    }
  };

  const handleAddPhase = () => {
    if (!currentSession) return;
    const newPhase = createEmptyPhase();
    const updated = addPhaseToSession(currentSession, newPhase);
    setCurrentSession(updated);
    setSessions(sessions.map((s) => (s.id === updated.id ? updated : s)));
    setSelectedPhase(newPhase);
  };

  const handleUpdatePhase = (phaseId: string, updates: Partial<GamePhase>) => {
    if (!currentSession) return;
    const updated = updatePhaseInSession(currentSession, phaseId, updates);
    setCurrentSession(updated);
    setSessions(sessions.map((s) => (s.id === updated.id ? updated : s)));
    if (selectedPhase && selectedPhase.id === phaseId) {
      setSelectedPhase({ ...selectedPhase, ...updates });
    }
  };

  const handleRemovePhase = (phaseId: string) => {
    if (!currentSession) return;
    if (!confirm('Are you sure you want to delete this phase?')) return;
    const updated = removePhaseFromSession(currentSession, phaseId);
    setCurrentSession(updated);
    setSessions(sessions.map((s) => (s.id === updated.id ? updated : s)));
    if (selectedPhase?.id === phaseId) {
      setSelectedPhase(null);
    }
  };

  const handleReorderPhases = (phaseIds: string[]) => {
    if (!currentSession) return;
    const updated = reorderPhases(currentSession, phaseIds);
    setCurrentSession(updated);
    setSessions(sessions.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleSelectPhase = (phaseId: string | null) => {
    if (!phaseId || !currentSession) {
      setSelectedPhase(null);
      return;
    }
    const phase = currentSession.phases?.find((p) => p.id === phaseId);
    setSelectedPhase(phase || null);
    setCurrentTab('questions');
  };

  const handleAddQuestion = () => {
    if (!selectedPhase || !currentSession) return;
    const newQuestion = createEmptyQuestion();
    const updatedPhase = addQuestionToPhase(selectedPhase, newQuestion);
    handleUpdatePhase(selectedPhase.id, updatedPhase);
    setEditingQuestion(newQuestion);
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<Question>) => {
    if (!selectedPhase || !currentSession) return;
    const updatedPhase = updateQuestionInPhase(selectedPhase, questionId, updates);
    handleUpdatePhase(selectedPhase.id, updatedPhase);
  };

  const handleRemoveQuestion = (questionId: string) => {
    if (!selectedPhase || !currentSession) return;
    if (!confirm('Are you sure you want to delete this question?')) return;
    const updatedPhase = removeQuestionFromPhase(selectedPhase, questionId);
    handleUpdatePhase(selectedPhase.id, updatedPhase);
    setEditingQuestion(null);
  };

  const handleExportGame = () => {
    if (!currentSession) return;
    const json = exportGameAsJSON(currentSession);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-${currentSession.gameCode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-400">Game Builder</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
            >
              Back to Dashboard
            </button>
            <button
              onClick={createNewGame}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
            >
              New Game
            </button>
          </div>
        </div>

        {!currentSession ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400 mb-6">Select a game or create a new one to get started</p>
            <div className="space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setCurrentSession(session)}
                  className="block w-full max-w-md mx-auto p-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded text-left"
                >
                  <div className="font-bold text-cyan-400">{session.title || session.gameCode}</div>
                  <div className="text-sm text-gray-400">{session.description || 'No description'}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {session.phases?.length || 0} phases · {calculateTotalPoints(session)} points
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-6 border-b border-gray-800">
              {(['overview', 'phases', 'questions', 'preview', 'settings'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCurrentTab(tab)}
                  className={`px-4 py-2 capitalize ${
                    currentTab === tab
                      ? 'border-b-2 border-cyan-500 text-cyan-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {currentTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-cyan-400 mb-2">Game Title</label>
                  <input
                    type="text"
                    value={currentSession.title || ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, title: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2"
                    placeholder="Enter game title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-cyan-400 mb-2">Description</label>
                  <textarea
                    value={currentSession.description || ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, description: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2 h-32"
                    placeholder="Enter game description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-900 border border-gray-700 rounded">
                    <div className="text-2xl font-bold text-cyan-400">{currentSession.phases?.length || 0}</div>
                    <div className="text-sm text-gray-400">Phases</div>
                  </div>
                  <div className="p-4 bg-gray-900 border border-gray-700 rounded">
                    <div className="text-2xl font-bold text-cyan-400">{calculateTotalPoints(currentSession)}</div>
                    <div className="text-sm text-gray-400">Total Points</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveCurrentGame}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                  >
                    Save Game
                  </button>
                  <button
                    onClick={handleExportGame}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Export JSON
                  </button>
                </div>
              </div>
            )}

            {currentTab === 'phases' && (
              <PhaseManager
                phases={currentSession.phases || []}
                onAddPhase={handleAddPhase}
                onUpdatePhase={handleUpdatePhase}
                onRemovePhase={handleRemovePhase}
                onReorderPhases={handleReorderPhases}
                onSelectPhase={handleSelectPhase}
                selectedPhaseId={selectedPhase?.id || null}
              />
            )}

            {currentTab === 'questions' && (
              <div className="space-y-4">
                {!selectedPhase ? (
                  <div className="text-center py-20 text-gray-400">
                    Select a phase from the Phases tab to manage questions
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-cyan-400">{selectedPhase.name}</h3>
                        <p className="text-sm text-gray-400">{selectedPhase.description}</p>
                      </div>
                      <button
                        onClick={handleAddQuestion}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
                      >
                        + Add Question
                      </button>
                    </div>

                    <div className="space-y-2">
                      {selectedPhase.questions.map((question, idx) => (
                        <div
                          key={question.id}
                          onClick={() => setEditingQuestion(question)}
                          className="p-4 bg-gray-900 border border-gray-700 hover:border-cyan-600 rounded cursor-pointer"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-gray-500">Q{idx + 1}</span>
                                <span className="text-lg font-bold text-cyan-300">{question.title}</span>
                                <span className="text-xs px-2 py-1 bg-gray-800 rounded">{question.type}</span>
                                <span className="text-xs px-2 py-1 bg-cyan-900 rounded">{question.difficulty}</span>
                              </div>
                              <p className="text-sm text-gray-400 mb-2">{question.content}</p>
                              <div className="flex gap-4 text-xs text-gray-500">
                                <span>{question.points} points</span>
                                {question.timeLimit && <span>{question.timeLimit}s limit</span>}
                                {question.maxAttempts && <span>{question.maxAttempts} attempts max</span>}
                                {question.hints && question.hints.length > 0 && (
                                  <span>{question.hints.length} hints</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {currentTab === 'preview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-cyan-400">Game Preview</h3>
                {(currentSession.phases || []).map((phase, phaseIdx) => (
                  <div key={phase.id} className="border border-gray-700 rounded p-4">
                    <h4 className="text-lg font-bold text-cyan-300 mb-2">
                      Phase {phaseIdx + 1}: {phase.name}
                    </h4>
                    <p className="text-sm text-gray-400 mb-4">{phase.description}</p>
                    <div className="space-y-2">
                      {phase.questions.map((question, qIdx) => (
                        <div key={question.id} className="bg-gray-900 p-3 rounded">
                          <div className="font-bold text-cyan-400 mb-1">
                            Q{qIdx + 1}: {question.title} ({question.points} pts)
                          </div>
                          <div className="text-sm text-gray-300">{question.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-cyan-400 mb-2">Oxygen Timer (minutes)</label>
                  <input
                    type="number"
                    value={currentSession.settings?.oxygenMinutes || 120}
                    onChange={(e) =>
                      setCurrentSession({
                        ...currentSession,
                        settings: {
                          ...currentSession.settings,
                          oxygenMinutes: parseInt(e.target.value) || 120,
                          maxPlayers: currentSession.settings?.maxPlayers || 4,
                        },
                      })
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-cyan-400 mb-2">Max Players</label>
                  <input
                    type="number"
                    value={currentSession.settings?.maxPlayers || 4}
                    onChange={(e) =>
                      setCurrentSession({
                        ...currentSession,
                        settings: {
                          ...currentSession.settings,
                          maxPlayers: parseInt(e.target.value) || 4,
                          oxygenMinutes: currentSession.settings?.oxygenMinutes || 120,
                        },
                      })
                    }
                    className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {editingQuestion && (
        <QuestionEditor
          question={editingQuestion}
          onUpdate={(updates) => handleUpdateQuestion(editingQuestion.id, updates)}
          onDelete={() => handleRemoveQuestion(editingQuestion.id)}
          onClose={() => setEditingQuestion(null)}
        />
      )}
    </div>
  );
}
